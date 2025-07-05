import pandas as pd

def analyze_temperature(csv_path='Body Temperature.csv'):
    try:
        # Step 1: Load CSV
        df = pd.read_csv(csv_path)

        # Step 2: Normalize column names
        df.columns = df.columns.str.strip().str.lower()

        # Step 3: Rename columns if needed
        df.rename(columns={
            'body.temp': 'body_temp',
            'heart.rate': 'heart_rate'
        }, inplace=True)

        # Step 4: Validate required columns
        required = ['body_temp', 'gender', 'heart_rate']
        for col in required:
            if col not in df.columns:
                print(f"❌ Missing column: {col}")
                return

        # Step 5: Drop missing values
        df.dropna(subset=required, inplace=True)

        # Step 6: Analyze latest record
        latest = df.tail(1).squeeze()
        temp = latest['body_temp']
        print("\n📍 Latest Reading:")
        print(f"  Temperature : {temp}°F")
        print(f"  Heart Rate  : {latest['heart_rate']} bpm")
        print(f"  Gender      : {latest['gender']}")

        # Step 7: Alert logic
        if temp > 100.4:
            print("  🔴 ALERT: Fever detected (temp > 100.4°F)")
        elif temp < 95:
            print("  🟡 ALERT: Possible hypothermia (temp < 95°F)")
        else:
            print("  ✅ Temperature within normal range")

        # Step 8: Summary statistics
        print("\n📊 Temperature Summary:")
        print(df['body_temp'].describe().round(2))

        # Step 9: Distribution stats
        fever = df[df['body_temp'] > 100.4]
        normal = df[(df['body_temp'] <= 100.4) & (df['body_temp'] >= 95)]
        cold = df[df['body_temp'] < 95]

        total = len(df)
        print("\n📈 Distribution:")
        print(f"  Normal Range (95°F – 100.4°F): {len(normal)} readings ({(len(normal)/total)*100:.2f}%)")
        print(f"  Fever (>100.4°F)             : {len(fever)} readings ({(len(fever)/total)*100:.2f}%)")
        print(f"  Low Temp (<95°F)             : {len(cold)} readings ({(len(cold)/total)*100:.2f}%)")

        # Step 10: Gender-based analysis
        print("\n👫 Gender-wise Average Temperature:")
        print(df.groupby('gender')['body_temp'].mean().round(2))

    except FileNotFoundError:
        print(f"❌ File not found: {csv_path}")
    except Exception as e:
        print("❌ Error during analysis:", e)

# Run the analysis
analyze_temperature()
