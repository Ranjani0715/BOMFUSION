import sys
import json

def analyze_line_balancing(data):
    operations = data.get("operations", [])
    target_takt_time = data.get("taktTime", 42.0)
    stations = data.get("stations", ["ST-100", "ST-200", "ST-300", "ST-400", "ST-500"])

    station_times = {st: 0.0 for st in stations}
    operation_counts = {st: 0 for st in stations}

    for op in operations:
        st = op.get("stationId") or op.get("station", "ST-100")
        cycle_time = float(op.get("cycleTime", 0))
        if st not in station_times:
            station_times[st] = 0.0
            operation_counts[st] = 0
        station_times[st] += cycle_time
        operation_counts[st] += 1

    max_cycle = max(station_times.values()) if station_times else 0.0
    bottleneck_station = max(station_times, key=station_times.get) if station_times else None

    total_work = sum(station_times.values())
    num_stations = len(stations) if stations else 1
    
    # Line Efficiency = Total Work Time / (Number of Stations * Max Cycle Time)
    efficiency = (total_work / (num_stations * max_cycle) * 100) if (num_stations * max_cycle) > 0 else 0.0
    
    # Smoothness Index (SI) = sqrt(sum((Max Cycle - Station Cycle)^2))
    variance_sum = sum((max_cycle - time) ** 2 for time in station_times.values())
    smoothness_index = (variance_sum ** 0.5)

    return {
        "engine": "Python Mathematical Optimization Engine",
        "targetTaktTimeSec": target_takt_time,
        "bottleneckStation": bottleneck_station,
        "maxStationCycleTimeSec": round(max_cycle, 1),
        "totalWorkContentSec": round(total_work, 1),
        "lineEfficiencyPct": round(efficiency, 2),
        "smoothnessIndex": round(smoothness_index, 2),
        "stationBreakdown": [
            {
                "stationId": st,
                "totalCycleTimeSec": round(time, 1),
                "operationCount": operation_counts[st],
                "utilizationPct": round((time / target_takt_time) * 100, 1),
                "isBottleneck": st == bottleneck_station,
                "status": "OVERLOADED" if time > target_takt_time else "BALANCED"
            }
            for st, time in station_times.items()
        ]
    }

def main():
    try:
        if len(sys.argv) > 1:
            input_data = sys.argv[1]
            data = json.loads(input_data)
        else:
            data = json.load(sys.stdin)
        
        result = analyze_line_balancing(data)
        print(json.dumps(result, indent=2))
    except Exception as e:
        error_res = {"error": str(e), "status": "failed"}
        print(json.dumps(error_res))
        sys.exit(1)

if __name__ == "__main__":
    main()
