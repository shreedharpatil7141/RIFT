from app.services.risk_engine import classify_risk

test_data = {
    "gene": "CYP2C19",
    "diplotype": "*2/*2",
    "phenotype": "Poor Metabolizer"
}

result = classify_risk("Clopidogrel", test_data)
print(result)
