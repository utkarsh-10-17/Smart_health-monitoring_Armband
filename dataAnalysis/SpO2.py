import pandas as pd

def analyze_spo2(csv_path='PPG signal of MAX30102.csv'):
    try:
        # Step 1: Load CSV
        df = pd.read_csv(csv_path)

        # Step 2: Normalize and rename column names
        df.columns = df.columns.str.strip().str.lower()

        df.rename(columns={
            'red (a.u)': 'red',
            'infra red (a.u)': 'infra_red',
            'infra red': 'infra_red',
            'red': 'red'  # optional fallback
        }, inplace=True)

        # Step 3: Check for required columns
        if 'red' not in df.columns or 'infra_red' not in df.columns:
            print("❌ CSV must contain 'red' and 'infra_red' columns. Found:", df.columns.tolist())
            return

        # Step 4: Drop missing rows
        df.dropna(subset=['red', 'infra_red'], inplace=True)

        # Step 5: Calculate Red/IR Ratio and SpO₂
        df['red/ir_ratio'] = df['red'] / df['infra_red']
        df['spo2 (%)'] = (110 - 25 * df['red/ir_ratio']).clip(lower=0, upper=100)

        # Step 6: Show latest reading
        latest = df.tail(1).squeeze()
        spo2 = latest['spo2 (%)']
        print("\n📍 Latest SpO₂ Reading:")
        print(f"  Red         : {int(latest['red'])}")
        print(f"  Infra Red   : {int(latest['infra_red'])}")
        print(f"  Ratio       : {round(latest['red/ir_ratio'], 4)}")
        print(f"  SpO₂ (%)    : {round(spo2, 2)}")

        # Step 7: Threshold-based alert only (no statistics)
        if spo2 < 94:
            print("  🔴 ALERT: Low SpO₂ detected (<94%)")
        elif spo2 > 100:
            print("  🟠 ALERT: Abnormally high SpO₂ (>100%) — sensor issue")
        else:
            print("  ✅ SpO₂ is within normal range (94–100%)")

        # Step 8: Optional Summary Display
        print("\n📊 SpO₂ Summary:")
        print(df['spo2 (%)'].describe().round(2))

        # Step 9: Fixed-range Distribution Summary
        total = len(df)
        low = df[df['spo2 (%)'] < 94].shape[0]
        normal = df[(df['spo2 (%)'] >= 94) & (df['spo2 (%)'] <= 100)].shape[0]
        high = df[df['spo2 (%)'] > 100].shape[0]

        print("\n📈 Threshold-Based Distribution:")
        print(f"  Normal (94–100%) : {normal} ({(normal/total)*100:.2f}%)")
        print(f"  Low (<94%)       : {low} ({(low/total)*100:.2f}%)")
        print(f"  High (>100%)     : {high} ({(high/total)*100:.2f}%)")

        # Step 10: Optional Gender-wise Summary
        if 'gender' in df.columns:
            print("\n👫 Gender-wise Average SpO₂:")
            print(df.groupby('gender')['spo2 (%)'].mean().round(2))

    except FileNotFoundError:
        print(f"❌ File not found: {csv_path}")
    except Exception as e:
        print("❌ Error during analysis:", e)

# Run the analysis
analyze_spo2()
