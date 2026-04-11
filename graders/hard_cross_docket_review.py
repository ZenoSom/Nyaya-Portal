"""
Grader for hard_cross_docket_review task.
Task: Select the strongest cross-docket escalation candidate.
Expected: case_id=20 (Ananya Panday, Criminal, 550 pending days, strongest across all dockets)
Score: strictly in (0.0, 1.0)
"""


def grade(output: str, expected_output: str = "20") -> float:
    """
    Grade the hard_cross_docket_review task.
    
    Args:
        output: The model's output (should be a case_id as string, or JSON)
        expected_output: The expected case_id ('20')
    
    Returns:
        float: Score between 0.0 and 1.0 (exclusive)
    """
    import json

    output_str = str(output).strip()
    expected_str = str(expected_output).strip()

    # Try to extract case_id from JSON output
    try:
        parsed = json.loads(output_str)
        if isinstance(parsed, dict):
            case_id = str(parsed.get("case_id", "")).strip()
            if case_id == expected_str:
                return 0.90
            # Partial credit: selected another high-severity case (case_id 5, 8, or 14)
            if case_id in ("5", "8", "14"):
                return 0.45
            if parsed.get("priority", "").lower() in ("urgent", "high"):
                return 0.25
            return 0.10
    except Exception:
        pass

    # Direct string match
    if output_str == expected_str:
        return 0.90

    # Partial credit: output contains the expected case_id
    if expected_str in output_str:
        return 0.55

    return 0.10
