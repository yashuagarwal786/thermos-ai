from typing import Dict, Any

class ClimateSimulator:
    # Thermal mitigation coefficients (degree Celsius reduction per 1% increase in index)
    COEFFICIENTS = {
        "green_cover": 0.16,      # e.g., +10% canopy = -1.6°C
        "water_bodies": 0.25,     # e.g., +10% pond surface = -2.5°C
        "reflective_roofs": 0.11, # e.g., +10% cool roofs = -1.1°C
        "concrete_reduction": 0.08 # e.g., -10% pavement area = -0.8°C
    }

    @classmethod
    def simulate(
        cls,
        base_temp: float,
        green_cover_delta: float,
        water_bodies_delta: float,
        reflective_roofs_delta: float,
        concrete_reduction_delta: float
    ) -> Dict[str, Any]:
        """
        Calculates localized temperature change (cooling delta) based on urban land cover
        revisions, applying microclimate heat budget coefficients.
        """
        # Calculate reductions from each category
        green_cooling = green_cover_delta * cls.COEFFICIENTS["green_cover"]
        water_cooling = water_bodies_delta * cls.COEFFICIENTS["water_bodies"]
        reflective_cooling = reflective_roofs_delta * cls.COEFFICIENTS["reflective_roofs"]
        pavement_cooling = concrete_reduction_delta * cls.COEFFICIENTS["concrete_reduction"]

        total_cooling = green_cooling + water_cooling + reflective_cooling + pavement_cooling
        simulated_temp = base_temp - total_cooling

        return {
            "initial_temperature": round(base_temp, 2),
            "simulated_temperature": round(simulated_temp, 2),
            "net_reduction": round(total_cooling, 2),
            "contributions": {
                "vegetation_canopy": round(green_cooling, 2),
                "hydrological_cooling": round(water_cooling, 2),
                "albedo_effect": round(reflective_cooling, 2),
                "permeable_pavement": round(pavement_cooling, 2)
            },
            "parameters": {
                "green_cover_increase_percent": green_cover_delta,
                "water_bodies_increase_percent": water_bodies_delta,
                "reflective_roofs_increase_percent": reflective_roofs_delta,
                "concrete_reduction_percent": concrete_reduction_delta
            }
        }
