# phenotype_mapper.py

PHENOTYPE_RULES = {
    "CYP2C19": {
        "0/0": ("*1/*1", "NM"),
        "0/1": ("*1/*2", "IM"),
        "1/1": ("*2/*2", "PM"),
    },
    "CYP2D6": {
        "0/0": ("*1/*1", "NM"),
        "0/1": ("*1/*4", "IM"),
        "1/1": ("*4/*4", "PM"),
    },
    "CYP2C9": {
        "0/0": ("*1/*1", "NM"),
        "0/1": ("*1/*3", "IM"),
        "1/1": ("*3/*3", "PM"),
    },
    "SLCO1B1": {
        "0/0": ("*1/*1", "NM"),
        "0/1": ("*1/*5", "IM"),
        "1/1": ("*5/*5", "PM"),
    },
    "TPMT": {
        "0/0": ("*1/*1", "NM"),
        "0/1": ("*1/*3A", "IM"),
        "1/1": ("*3A/*3A", "PM"),
    },
    "DPYD": {
        "0/0": ("*1/*1", "NM"),
        "0/1": ("*1/*2A", "IM"),
        "1/1": ("*2A/*2A", "PM"),
    },
}


def map_to_phenotype(gene_variants):
    results = {}

    for gene, data in gene_variants.items():

        genotypes = data.get("genotypes", [])
        rsids = data.get("rsids", [])

        if not genotypes:
            results[gene] = {
                "diplotype": "Unknown",
                "phenotype": "Unknown",
                "rsids": rsids
            }
            continue

        genotype = genotypes[0]  # MVP simplification

        gene_rules = PHENOTYPE_RULES.get(gene, {})

        if genotype in gene_rules:
            diplotype, phenotype = gene_rules[genotype]
        else:
            diplotype, phenotype = "Unknown", "Unknown"

        results[gene] = {
            "diplotype": diplotype,
            "phenotype": phenotype,
            "rsids": rsids
        }

    return results


# ✅ ADD THIS FUNCTION (THIS FIXES YOUR ERROR)
def determine_phenotype(gene_name, genotypes):
    """
    Wrapper function so analyze.py can call determine_phenotype()
    """

    gene_data = {
        gene_name: {
            "genotypes": genotypes,
            "rsids": []
        }
    }

    result = map_to_phenotype(gene_data)

    if gene_name in result:
        return result[gene_name]["phenotype"]

    return "Unknown"