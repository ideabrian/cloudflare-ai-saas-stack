Extract a component using the proven AZOT methodology: $ARGUMENTS

Follow the systematic component extraction process:

**AUDIT**:
- Use `rg -n "useState"` to map state boundaries
- Identify extraction candidates and dependencies
- Analyze the component's single responsibility

**ZONE**:
- Define the component boundary clearly
- Plan the callback props interface (onSuccess, onError, onRefresh pattern)
- Ensure loose coupling design

**OPTIMIZE**:
- Extract with callback props pattern
- Preserve all functionality identically
- Verify build passes after extraction

**TRANSFER**:
- Document the extraction patterns used
- Measure success (line count reduction, useState reduction)
- Prepare template for next extraction

Success criteria: Build passes, behavior identical, single responsibility maintained.