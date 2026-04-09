def grade(output, expected_output):
    """
    Grader for hard_cross_docket_review: Select the strongest cross-docket escalation candidate.
    Expected output is '20'.
    """
    return 0.9 if str(output).strip() == str(expected_output).strip() else 0.1
