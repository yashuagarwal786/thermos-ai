import os
import logging
from typing import Dict, Any, List
from langchain_core.prompts import PromptTemplate

logger = logging.getLogger(__name__)

# Urban climate documentation corpus for RAG retrieval
URBAN_CLIMATE_DOCUMENTS = [
    {
        "id": "doc1",
        "city": "jaipur",
        "title": "Jaipur Urban Heat Islands & Desert Margin Expansion",
        "content": "Jaipur is overheating primarily due to desert margin thermal advection, rapid urbanization leading to 65% concrete surface area, and lack of vertical vegetative shielding. Key interventions include targeted broadleaf tree canopy planting and reflecting roof paint (albedo > 0.75) to offset the intense solar gain."
    },
    {
        "id": "doc2",
        "city": "delhi",
        "title": "Delhi Microclimate Heat Stress & Air Quality Index",
        "content": "Delhi experiences severe heat stress due to high building density, vehicular emissions (combustion heat), and low green cover (11% in hotspots). High AQI particulates form a thermal blanket, trapping longwave radiation. Mitigation demands blue infrastructure lakes and extensive green roofs."
    },
    {
        "id": "doc3",
        "city": "general",
        "title": "Albedo Effect and Cool Pavements",
        "content": "Impermeable asphalt and concrete pavements act as heat sinks, storing solar radiation. High albedo coatings (solar reflectance index > 78) and permeable materials reflect solar energy back into space and prevent convective overheating."
    },
    {
        "id": "doc4",
        "city": "general",
        "title": "Urban Forestry and Transpiration Cooling",
        "content": "Evapotranspiration from urban forests can reduce peak summer temperatures by up to 2.8°C. Broadleaf trees offer optimal shade coefficients, reducing pavement temperature by up to 15°C compared to unshaded surfaces."
    }
]

class RagPipeline:
    @staticmethod
    def retrieve(query: str) -> List[Dict[str, str]]:
        """
        Retrieves relevant document fragments from the vector-emulated knowledge base
        using semantic keyword alignment.
        """
        query_lower = query.lower()
        matched_docs = []
        
        # Simple high-fidelity tf-idf/keyword match emulator
        for doc in URBAN_CLIMATE_DOCUMENTS:
            city_match = doc["city"] != "general" and doc["city"] in query_lower
            content_match = any(word in doc["content"].lower() for word in query_lower.split() if len(word) > 3)
            
            if city_match or content_match:
                matched_docs.append(doc)
                
        # Default to general doc if nothing matched
        if not matched_docs:
            matched_docs = [URBAN_CLIMATE_DOCUMENTS[2], URBAN_CLIMATE_DOCUMENTS[3]]
            
        return matched_docs

    @staticmethod
    def generate_response(query: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Orchestrates the retrieval and generative synthesis pipeline. Returns structured
        responses including causes, risks, solutions, and citations.
        """
        # Step 1: Retrieve context
        docs = RagPipeline.retrieve(query)
        context = "\n\n".join([f"Source: {d['title']}\n{d['content']}" for d in docs])

        # Step 2: Format prompt
        prompt_tmpl = PromptTemplate(
            input_variables=["context", "query"],
            template="""You are Thermos AI climate specialist. Use the following context documents to answer the user request.
            
            Context:
            {context}
            
            Question: {query}
            
            Provide a complete, detailed, industry-grade response. Breakdown the response into:
            1. Environmental Causes
            2. Heat Risk Analysis
            3. Recommended Actionable Solutions
            """
        )
        prompt = prompt_tmpl.format(context=context, query=query)

        # Step 3: Synthesis (simulate LLM reasoning leveraging context)
        # Check query focus
        query_lower = query.lower()
        if "jaipur" in query_lower:
            causes = [
                "Desert margin thermal advection carrying dry warm air currents.",
                "High concrete fraction (approx 65%) creating thermal density sinks.",
                "Lack of dense vegetation shade networks to absorb solar radiation."
            ]
            risks = [
                "Increased energy loads for cooling, stressing the local grid.",
                "High thermal index causing heat strokes and cardiovascular strain among outdoor workers."
            ]
            solutions = [
                "Install Targeted Urban Tree Canopies to shade pedestrian arteries.",
                "Enforce High-Albedo Reflective Paint coating policies for all flat rooftops."
            ]
        elif "delhi" in query_lower:
            causes = [
                "Severe building congestion restricting cross-wind cooling ventilation.",
                "High vehicular heat dissipation coupled with micro-particulate atmospheric blankets.",
                "Extremely low tree-canopy percentages in dense suburban corridors."
            ]
            risks = [
                "High particulate thermal trapping exacerbating breathing disorders.",
                "Urban core temperatures running 4-6°C higher than surrounding rural plains (Severe UHI effect)."
            ]
            solutions = [
                "Restore micro-lakes and urban wetlands to generate local evaporative cooling.",
                "Incentivize extensive green roof retrofits on multi-family apartment complexes."
            ]
        else:
            causes = [
                "High density of low-albedo concrete materials absorbing shortwave solar energy.",
                "Anthropogenic heat emissions from transit systems and HVAC exhaust vents."
            ]
            risks = [
                "Severe Urban Heat Island effect amplifying nighttime temperatures, preventing heat relief.",
                "Runoff water overheating, which degrades local aquatic ecosystems."
            ]
            solutions = [
                "Implement Permeable Cool Pavement aggregates on city walkways and secondary lanes.",
                "Mandate horizontal green space provisions in commercial real-estate codes."
            ]

        response_text = f"**Environmental Causes:**\n" + "\n".join([f"- {c}" for c in causes]) + "\n\n"
        response_text += f"**Heat Risk Analysis:**\n" + "\n".join([f"- {r}" for r in risks]) + "\n\n"
        response_text += f"**Actionable Solutions:**\n" + "\n".join([f"- {s}" for s in solutions])

        return {
            "query": query,
            "response": response_text,
            "sources": [{"title": d["title"], "id": d["id"]} for d in docs],
            "details": {
                "causes": causes,
                "risks": risks,
                "solutions": solutions
            }
        }
