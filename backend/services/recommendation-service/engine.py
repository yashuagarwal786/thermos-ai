from typing import List, Dict, Any

class RecommendationEngine:
    INTERVENTIONS = {
        "tree_canopy": {
            "name": "Targeted Urban Tree Canopy Expansion",
            "category": "Urban Forestry",
            "base_cooling_efficiency": 0.18, # °C drop per 1% cover increase
            "cost_per_sqm": 25.0,
            "timeline": "1-3 years",
            "description": "Planting broadleaf native trees in high thermal concentration areas to provide physical shading and evapotranspiration."
        },
        "green_roofs": {
            "name": "Extensive Green Roof Installation",
            "category": "Infrastructure",
            "base_cooling_efficiency": 0.12,
            "cost_per_sqm": 85.0,
            "timeline": "6-18 months",
            "description": "Retrofitting commercial and residential rooftops with light-weight succulent and grass covers to reduce roof heat transmission."
        },
        "cool_roofs": {
            "name": "High-Albedo Reflective Roof Coatings",
            "category": "Infrastructure",
            "base_cooling_efficiency": 0.10,
            "cost_per_sqm": 12.0,
            "timeline": "1-3 months",
            "description": "Applying high-solar-reflectance white elastomer paints (Albedo >= 0.75) to existing flat rooftop concrete surfaces."
        },
        "cool_pavements": {
            "name": "Permeable Cool Pavement Resurfacing",
            "category": "Transit Systems",
            "base_cooling_efficiency": 0.08,
            "cost_per_sqm": 45.0,
            "timeline": "6-12 months",
            "description": "Replacing dark asphalt with light-colored permeable concrete aggregates that absorb less solar radiation and drain surface water."
        },
        "water_bodies": {
            "name": "Hydrological Micro-Reservoir Restoration",
            "category": "Blue Infrastructure",
            "base_cooling_efficiency": 0.28,
            "cost_per_sqm": 120.0,
            "timeline": "12-24 months",
            "description": "Constructing retention ponds, bio-swales, and restoring historical urban lakes to induce convective boundary layer cooling."
        },
        "vertical_gardens": {
            "name": "Façade Greening and Vertical Gardens",
            "category": "Urban Design",
            "base_cooling_efficiency": 0.06,
            "cost_per_sqm": 60.0,
            "timeline": "3-9 months",
            "description": "Establishing climbing plants on building walls to shield masonry surfaces from direct solar irradiance."
        }
    }

    @classmethod
    def generate_recommendations(
        cls,
        city: str,
        concrete_percent: float,
        green_cover_percent: float,
        population_density: float,
        base_temp: float,
        budget: str = "medium"
    ) -> Dict[str, Any]:
        """
        Processes urban heat indices to generate ranked climate mitigation strategies
        with localized cooling reductions and project viability scoring.
        """
        recommendations = []
        severity = "moderate"
        if base_temp >= 38.0 or concrete_percent > 65.0:
            severity = "critical"
        elif base_temp < 30.0:
            severity = "low"

        # Rule-based selector and priority calculator
        # Intervention 1: Tree Canopy
        if green_cover_percent < 25.0:
            rec = cls.INTERVENTIONS["tree_canopy"].copy()
            rec["target_increase_percent"] = 15.0 if green_cover_percent < 15.0 else 10.0
            rec["est_cooling"] = round(rec["target_increase_percent"] * rec["base_cooling_efficiency"], 2)
            rec["priority"] = "HIGH" if severity == "critical" else "MEDIUM"
            rec["feasibility_score"] = 85 if population_density < 10000 else 60
            recommendations.append(rec)

        # Intervention 2: Cool Roofs (high priority, low cost, fast deployment)
        if concrete_percent > 40.0:
            rec = cls.INTERVENTIONS["cool_roofs"].copy()
            rec["target_increase_percent"] = 25.0 if budget in ["medium", "high"] else 15.0
            rec["est_cooling"] = round(rec["target_increase_percent"] * rec["base_cooling_efficiency"], 2)
            rec["priority"] = "HIGH" if concrete_percent > 60.0 else "MEDIUM"
            rec["feasibility_score"] = 90
            recommendations.append(rec)

        # Intervention 3: Green Roofs (depends on budget)
        if concrete_percent > 50.0 and budget in ["medium", "high"]:
            rec = cls.INTERVENTIONS["green_roofs"].copy()
            rec["target_increase_percent"] = 10.0
            rec["est_cooling"] = round(rec["target_increase_percent"] * rec["base_cooling_efficiency"], 2)
            rec["priority"] = "MEDIUM" if budget == "medium" else "HIGH"
            rec["feasibility_score"] = 70
            recommendations.append(rec)

        # Intervention 4: Cool Pavements
        if concrete_percent > 55.0:
            rec = cls.INTERVENTIONS["cool_pavements"].copy()
            rec["target_increase_percent"] = 15.0
            rec["est_cooling"] = round(rec["target_increase_percent"] * rec["base_cooling_efficiency"], 2)
            rec["priority"] = "MEDIUM"
            rec["feasibility_score"] = 75
            recommendations.append(rec)

        # Intervention 5: Water Bodies (demands high budget and space)
        if severity == "critical" and budget == "high":
            rec = cls.INTERVENTIONS["water_bodies"].copy()
            rec["target_increase_percent"] = 5.0
            rec["est_cooling"] = round(rec["target_increase_percent"] * rec["base_cooling_efficiency"], 2)
            rec["priority"] = "HIGH"
            rec["feasibility_score"] = 50  # Harder to construct in high density
            recommendations.append(rec)

        # Intervention 6: Vertical Gardens
        if population_density > 12000:
            rec = cls.INTERVENTIONS["vertical_gardens"].copy()
            rec["target_increase_percent"] = 8.0
            rec["est_cooling"] = round(rec["target_increase_percent"] * rec["base_cooling_efficiency"], 2)
            rec["priority"] = "MEDIUM"
            rec["feasibility_score"] = 80
            recommendations.append(rec)

        # Sort recommendations by priority (HIGH first) and cooling output
        priority_map = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}
        recommendations.sort(key=lambda x: (priority_map.get(x["priority"], 0), x["est_cooling"]), reverse=True)

        total_simulated_cooling = sum(r["est_cooling"] for r in recommendations)

        return {
            "city": city,
            "baseline_temperature": base_temp,
            "heat_severity": severity,
            "recommendations": recommendations,
            "cumulative_simulated_cooling": round(total_simulated_cooling, 2),
            "projected_temperature_post_mitigation": round(base_temp - total_simulated_cooling, 2)
        }
