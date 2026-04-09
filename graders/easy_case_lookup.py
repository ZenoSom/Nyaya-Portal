def grade(output, expected_output):
    """
    Grader for easy_case_lookup: Find the oldest pending property matter.
    Expected output is '8'.
    """
    return 0.8 if str(output).strip() == str(expected_output).strip() else 0.2
