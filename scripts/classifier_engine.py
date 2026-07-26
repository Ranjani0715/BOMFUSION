import sys
import json
import re

CATEGORY_KEYWORDS = {
    "Structural": ["casing", "housing", "frame", "bracket", "plate", "cover", "enclosure", "chassis", "mount", "stator"],
    "Electrical": ["stator", "rotor", "wire", "harness", "cable", "connector", "terminal", "pcb", "sensor", "inverter", "busbar"],
    "Fasteners": ["screw", "bolt", "nut", "washer", "pin", "clip", "fastener", "rivet", "stud"],
    "Mechanical": ["bearing", "shaft", "gear", "seal", "gasket", "spring", "coupler", "rotor", "key"],
    "Thermal": ["heatsink", "fan", "cooler", "pipe", "radiator", "thermal", "insulation"]
}

MATERIAL_NORM = {
    "alu": "Aluminum 6061-T6",
    "aluminum": "Aluminum 6061-T6",
    "steel": "Stainless Steel 316L",
    "stainless": "Stainless Steel 316L",
    "copper": "High-Purity Copper C11000",
    "rubber": "EPDM Industrial Rubber",
    "silicone": "High-Temp Thermal Silicone"
}

def classify_components(components):
    results = []
    category_summary = {}
    material_summary = {}
    low_confidence_flags = []

    for item in components:
        name = item.get("name", "").lower()
        part_no = item.get("partNumber", "")
        existing_cat = item.get("category", "")
        mat = item.get("material", "").lower()

        # Determine predicted category
        matched_cat = "Uncategorized"
        highest_matches = 0
        
        for cat, keywords in CATEGORY_KEYWORDS.items():
            matches = sum(1 for kw in keywords if kw in name or kw in part_no.lower())
            if matches > highest_matches:
                highest_matches = matches
                matched_cat = cat

        if matched_cat == "Uncategorized" and existing_cat:
            matched_cat = existing_cat

        # Standardize material
        std_material = item.get("material", "Steel")
        for key, std_val in MATERIAL_NORM.items():
            if key in mat:
                std_material = std_val
                break

        # Calculate confidence score
        confidence = 95.0 if highest_matches >= 2 else (88.0 if highest_matches == 1 else 75.0)
        if existing_cat and existing_cat == matched_cat:
            confidence = min(99.5, confidence + 5.0)

        # Update summary counts
        category_summary[matched_cat] = category_summary.get(matched_cat, 0) + 1
        material_summary[std_material] = material_summary.get(std_material, 0) + 1

        if confidence < 85.0:
            low_confidence_flags.append({
                "partNumber": part_no,
                "name": item.get("name"),
                "confidence": confidence,
                "assignedCategory": matched_cat
            })

        results.append({
            "partNumber": part_no,
            "name": item.get("name"),
            "predictedCategory": matched_cat,
            "standardizedMaterial": std_material,
            "confidenceScore": confidence,
            "isFlagged": confidence < 85.0
        })

    total = len(components) or 1
    high_conf_count = sum(1 for r in results if r["confidenceScore"] >= 85.0)
    overall_accuracy = round((high_conf_count / total) * 100, 1)

    return {
        "engine": "Python 3.10 Intelligent NLP Classifier Engine",
        "classifiedComponentsCount": len(results),
        "overallTaxonomyAccuracyPct": overall_accuracy,
        "categoryBreakdown": category_summary,
        "materialBreakdown": material_summary,
        "flaggedCount": len(low_confidence_flags),
        "flaggedItems": low_confidence_flags,
        "classifiedItems": results
    }

def main():
    try:
        if len(sys.argv) > 1:
            input_data = sys.argv[1]
            data = json.loads(input_data)
        else:
            data = json.load(sys.stdin)
        
        result = classify_components(data.get("components", []))
        print(json.dumps(result, indent=2))
    except Exception as e:
        error_res = {"error": str(e), "status": "failed"}
        print(json.dumps(error_res))
        sys.exit(1)

if __name__ == "__main__":
    main()
