def grade(output, expected_output):
    """
    Grader for medium_backlog_triage: Prioritize the most urgent criminal backlog.
    Expected output is '20'.
    """
    return 0.75 if str(output).strip() == str(expected_output).strip() else 0.25
