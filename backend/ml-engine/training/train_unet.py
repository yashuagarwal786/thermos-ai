import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torch.utils.tensorboard import SummaryWriter
import numpy as np

from ..models.unet import UNet

class SyntheticSatelliteDataset(Dataset):
    """
    Generates high-fidelity synthetic multispectral raster tiles for stable 
    offline model training and pipeline verification.
    """
    def __init__(self, size=100, height=256, width=256, channels=4):
        self.size = size
        self.height = height
        self.width = width
        self.channels = channels

    def __len__(self):
        return self.size

    def __getitem__(self, idx):
        # Channels: 0=Red, 1=Green, 2=Blue, 3=Thermal
        x = np.random.randn(self.channels, self.height, self.width).astype(np.float32)
        
        # Create correlated thermal heat islands (Channel 3 has higher local heat)
        # Create radial hotspot anomalies
        y = np.zeros((1, self.height, self.width), dtype=np.float32)
        cx, cy = np.random.randint(50, 200, size=2)
        r = np.random.randint(20, 60)
        
        for i in range(self.height):
            for j in range(self.width):
                if (i - cx)**2 + (j - cy)**2 < r**2:
                    x[3, i, j] += 2.5 # Inject thermal intensity
                    y[0, i, j] = 1.0  # Segmented target label
                    
        return torch.from_numpy(x), torch.from_numpy(y)

def dice_loss(pred, target, smooth=1e-5):
    """
    Computes Dice coefficient loss for handling class imbalances.
    """
    pred_flat = pred.view(-1)
    target_flat = target.view(-1)
    intersection = (pred_flat * target_flat).sum()
    return 1 - ((2. * intersection + smooth) / (pred_flat.sum() + target_flat.sum() + smooth))

def train_segmentation_pipeline(epochs=5, batch_size=4, lr=1e-3, checkpoint_dir="./checkpoints"):
    os.makedirs(checkpoint_dir, exist_ok=True)
    writer = SummaryWriter(log_dir="./runs/unet_experiment")
    
    # Initialize dataset & dataloader
    train_dataset = SyntheticSatelliteDataset(size=40)
    val_dataset = SyntheticSatelliteDataset(size=10)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    # Device configuration
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training U-Net segmenter on device: {device}")
    
    model = UNet(n_channels=4, n_classes=1).to(device)
    optimizer = optim.Adam(model.parameters(), lr=lr)
    bce_loss_fn = nn.BCELoss()
    
    for epoch in range(1, epochs + 1):
        model.train()
        epoch_loss = 0.0
        
        for step, (images, masks) in enumerate(train_loader):
            images, masks = images.to(device), masks.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            
            # Combined BCE & Dice Loss
            bce = bce_loss_fn(outputs, masks)
            dice = dice_loss(outputs, masks)
            loss = 0.6 * bce + 0.4 * dice
            
            loss.backward()
            optimizer.step()
            
            epoch_loss += loss.item()
            
        mean_epoch_loss = epoch_loss / len(train_loader)
        writer.add_scalar("Loss/Train", mean_epoch_loss, epoch)
        
        # Validation Loop
        model.eval()
        val_loss = 0.0
        iou_sum = 0.0
        
        with torch.no_grad():
            for val_images, val_masks in val_loader:
                val_images, val_masks = val_images.to(device), val_masks.to(device)
                val_outputs = model(val_images)
                
                v_bce = bce_loss_fn(val_outputs, val_masks)
                v_dice = dice_loss(val_outputs, val_masks)
                val_loss += (0.6 * v_bce + 0.4 * v_dice).item()
                
                # Compute simple IoU
                preds = (val_outputs > 0.5).float()
                intersection = (preds * val_masks).sum()
                union = preds.sum() + val_masks.sum() - intersection
                iou_sum += (intersection + 1e-5) / (union + 1e-5)
                
        mean_val_loss = val_loss / len(val_loader)
        mean_iou = float(iou_sum / len(val_loader))
        
        writer.add_scalar("Loss/Validation", mean_val_loss, epoch)
        writer.add_scalar("Metrics/mIoU", mean_iou, epoch)
        
        print(f"Epoch {epoch}/{epochs} | Train Loss: {mean_epoch_loss:.4f} | Val Loss: {mean_val_loss:.4f} | mIoU: {mean_iou:.4f}")
        
        # Save checkpoints
        checkpoint_path = os.path.join(checkpoint_dir, f"unet_epoch_{epoch}.pth")
        torch.save({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'loss': mean_epoch_loss,
        }, checkpoint_path)
        
    writer.close()
    print("Training pipeline execution completed. Checkpoints saved successfully.")

if __name__ == "__main__":
    train_segmentation_pipeline(epochs=2)
