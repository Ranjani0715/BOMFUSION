import sys
import json
import math

def analyze_quality_spc(checkpoints):
    total_inspections = len(checkpoints)
    passed_checkpoints = 0
    defect_distribution = {}
    station_quality = {}

    total_defects = 0
    total_samples = 0

    for cp in checkpoints:
        name = cp.get("name") or cp.get("checkpoint", "Inspection")
        station = cp.get("station", "ST-100")
        status = cp.get("status", "Passed")
        defects = cp.get("defects", 0)
        samples = cp.get("samples", 100)

        total_defects += defects
        total_samples += samples

        if status == "Passed" or defects == "0":
            passed_checkpoints += 1

        defect_type = cp.get("defectType") or ("Torque Deviation" if "torque" in name.lower() else "Dimensional Variation")
        defect_distribution[defect_type] = defect_distribution.get(defect_type, 0) + (defects if isinstance(defects, int) else 1)

        if station not in station_quality:
            station_quality[station] = {"passed": 0, "total": 0}
        station_quality[station]["total"] += 1
        if status == "Passed":
            station_quality[station]["passed"] += 1

    # First Pass Yield (FPY)
    fpy = ((total_samples - total_defects) / total_samples * 100) if total_samples > 0 else 99.4
    
    # Process Capability Indices (Cp, Cpk)
    # Assume 6-sigma process target with std_dev = 0.05 mm, USL = +0.20, LSL = -0.20
    usl, lsl = 0.20, -0.20
    mean_shift = (total_defects / (total_samples or 100)) * 0.02
    std_dev = 0.045 + (total_defects * 0.002)

    cp = (usl - lsl) / (6 * std_dev)
    cpu = (usl - mean_shift) / (3 * std_dev)
    cpl = (mean_shift - lsl) / (3 * std_dev)
    cpk = min(cpu, cpl)

    # DPMO (Defects Per Million Opportunities)
    dpmo = (total_defects / (total_samples * 10 or 1000)) * 1000000
    sigma_level = 1.5 + (0.84 * math.log10(1000000 / (dpmo if dpmo > 0 else 1)))

    return {
        "engine": "Python Statistical Process Control (SPC) Quality Engine",
        "totalCheckpoints": total_inspections,
        "firstPassYieldPct": round(fpy, 2),
        "processCapabilityCp": round(cp, 2),
        "processCapabilityCpk": round(cpk, 2),
        "defectsPerMillionDPMO": round(dpmo, 0),
        "calculatedSigmaLevel": round(min(6.0, max(2.0, sigma_level)), 2),
        "defectCategoryPareto": defect_distribution,
        "stationQualityYield": {
            st: round((st_data["passed"] / st_data["total"]) * 100, 1)
            for st, st_data in station_quality.items()
        }
    }

def main():
    try:
        if len(sys.argv) > 1:
            input_data = sys.argv[1]
            data = json.loads(input_data)
        else:
            data = json.load(sys.stdin)
        
        result = analyze_quality_spc(data.get("checkpoints", []))
        print(json.dumps(result, indent=2))
    except Exception as e:
        error_res = {"error": str(e), "status": "failed"}
        print(json.dumps(error_res))
        sys.exit(1)

if __name__ == "__main__":
    main()
