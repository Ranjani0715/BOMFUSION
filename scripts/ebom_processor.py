import sys
import json

def process_ebom(components):
    total_parts = len(components)
    total_weight = 0.0
    category_counts = {}
    material_distribution = {}
    level_counts = {1: 0, 2: 0, 3: 0}
    high_risk_components = []

    for item in components:
        qty = item.get("quantity", 1)
        weight_str = item.get("weight", "0kg").replace("kg", "").strip()
        try:
            weight = float(weight_str) * qty
        except ValueError:
            weight = 0.0
        
        total_weight += weight

        category = item.get("category", "Uncategorized")
        category_counts[category] = category_counts.get(category, 0) + qty

        material = item.get("material", "Unknown")
        material_distribution[material] = material_distribution.get(material, 0) + qty

        level = item.get("level", 1)
        if level in level_counts:
            level_counts[level] += 1
        else:
            level_counts[level] = 1

        confidence = item.get("confidence", 100)
        if confidence < 90 or item.get("status") == "Flagged":
            high_risk_components.append({
                "partNumber": item.get("partNumber"),
                "name": item.get("name"),
                "confidence": confidence,
                "reason": "Low AI classification confidence or flagged status"
            })

    summary = {
        "engine": "Python 3.10 Data Engine",
        "totalComponents": total_parts,
        "calculatedTotalWeightKg": round(total_weight, 2),
        "levelCounts": level_counts,
        "categoryDistribution": category_counts,
        "materialDistribution": material_distribution,
        "highRiskComponents": high_risk_components,
        "assemblyCompletenessPct": 100.0 if total_parts >= 20 else round((total_parts / 25.0) * 100, 1)
    }
    return summary

def main():
    try:
        if len(sys.argv) > 1:
            input_data = sys.argv[1]
            data = json.loads(input_data)
        else:
            data = json.load(sys.stdin)
        
        result = process_ebom(data.get("components", []))
        print(json.dumps(result, indent=2))
    except Exception as e:
        error_res = {"error": str(e), "status": "failed"}
        print(json.dumps(error_res))
        sys.exit(1)

if __name__ == "__main__":
    main()
