import subprocess
import sys
import time
import os

SERVICES = [
    {"name": "auth-service", "port": 8001, "module": "services.authentication-service.main:app"},
    {"name": "satellite-service", "port": 8002, "module": "services.satellite-service.main:app"},
    {"name": "prediction-service", "port": 8003, "module": "services.prediction-service.main:app"},
    {"name": "simulation-service", "port": 8004, "module": "services.simulation-service.main:app"},
    {"name": "recommendation-service", "port": 8005, "module": "services.recommendation-service.main:app"},
    {"name": "chatbot-service", "port": 8006, "module": "services.chatbot-service.main:app"}
]

def main():
    processes = []
    print("==================================================")
    print("Thermos AI - Launching Microservices Local Cluster")
    print("==================================================")
    
    # Configure PYTHONPATH to current backend directory
    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.dirname(os.path.abspath(__file__))

    for svc in SERVICES:
        cmd = [
            sys.executable, "-m", "uvicorn", 
            svc["module"], 
            "--host", "0.0.0.0", 
            "--port", str(svc["port"])
        ]
        print(f"[Cluster] Starting {svc['name']} on http://localhost:{svc['port']}...")
        p = subprocess.Popen(cmd, env=env)
        processes.append((svc["name"], p))
        time.sleep(1.0) # Grace period between starts

    print("\n[Cluster] All backend services are running. Press Ctrl+C to terminate.")
    
    try:
        # Keep monitoring child processes
        while True:
            for name, p in processes:
                if p.poll() is not None:
                    print(f"[Cluster] WARNING: {name} terminated unexpectedly with code {p.returncode}")
            time.sleep(5)
    except KeyboardInterrupt:
        print("\n[Cluster] Stopping all microservices...")
        for name, p in processes:
            print(f"[Cluster] Terminating {name}...")
            p.terminate()
            p.wait()
        print("[Cluster] All services stopped.")

if __name__ == "__main__":
    main()
