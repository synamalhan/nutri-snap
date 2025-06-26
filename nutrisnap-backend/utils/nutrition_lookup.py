import pandas as pd

# Load CSV data once
df = pd.read_csv("data/food_db.csv")

def lookup_nutrition(detections):
    items = []
    total = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}

    for det in detections:
        food_name = det["name"]
        row = df[df["name"].str.lower() == food_name.lower()].head(1)

        if not row.empty:
            item = {
                "name": food_name,
                "confidence": det["confidence"],
                "calories": int(row["calories"].values[0]),
                "protein": int(row["protein"].values[0]),
                "carbs": int(row["carbs"].values[0]),
                "fat": int(row["fat"].values[0])
            }
            items.append(item)

            # Add to totals
            for key in total:
                total[key] += item[key]

    return items, total
