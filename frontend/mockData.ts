export const mockResult = {
  patient_id: "PATIENT_001",
  risk_assessment: {
    risk_label: "Adjust Dosage",
    confidence_score: 0.87,
    severity: "moderate"
  },
  pharmacogenomic_profile: {
    primary_gene: "CYP2C19",
    diplotype: "*2/*2",
    phenotype: "Poor Metabolizer"
  },
  clinical_recommendation: {
    recommendation: "Reduce dosage or consider alternative therapy."
  },
  llm_generated_explanation: {
    summary:
      "The patient carries CYP2C19 *2/*2 variants leading to reduced metabolism of the selected drug, increasing risk of adverse effects."
  }
};
