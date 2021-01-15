import gspread
import json

GOOGLE_CREDENTIALS_FILE="gcred.json"
HOSPITAL_SHEET_ID="1eJkM4F0h4sXYpljEnIdbS2AOPif6cxVs38KTUoa--BA"

print("Connecting to Google Sheet...")
gc = gspread.service_account(filename=GOOGLE_CREDENTIALS_FILE)

sh = gc.open_by_key(HOSPITAL_SHEET_ID)
GENERATED_JSON = {"type": "FeatureCollection", "features":[]}

hospitals = sh.get_worksheet(0)
hospital_data = hospitals.get_all_records()

def prettify_phone(num):
    num = str(num)
    return f"({num[0:3]}) {num[3:6]}-{num[6:]}"

for i, hospital in enumerate(hospital_data):
    hosp_obj = {
        "type": "Feature", 
        "properties":{
            "name": hospital['Facility'],
            "address": hospital['Address'],
            "phone": prettify_phone(hospital['Phone_Num']),
            "has_doses": True if hospital['Has_Doses'].lower() == 'y' else False,
            "last_update": hospital['Last_Update_Time'],
        }, 
        "geometry": {
            "type":"Point",
            "coordinates": [hospital['Y'], hospital['X']],
        },
    }

    GENERATED_JSON["features"].append(hosp_obj)

# GENERATED_JSON = json.dumps(GENERATED_JSON, indent=2) 
with open("../src/data/hospitals.json", "w") as fp:
    json.dump(GENERATED_JSON, fp, indent=2)