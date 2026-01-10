#!/bin/bash
# Ralph Loop - Autonomous Claude Code Development Loop
# Based on the Ralph Wiggum technique for Claude Code

set -e

PROJECT_NAME="${1:-}"
MAX_ITERATIONS="${2:-25}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Validate project argument
if [ -z "$PROJECT_NAME" ]; then
  echo -e "${RED}Error: No project name provided${NC}"
  echo ""
  echo "Usage: ./ralph.sh <project-name> [max-iterations]"
  echo "Example: ./ralph.sh landing-redesign 25"
  echo ""
  echo "Available projects:"
  ls -d .claude/ralph/*/ 2>/dev/null | xargs -n1 basename || echo "  (none found)"
  exit 1
fi

PROJECT_DIR=".claude/ralph/$PROJECT_NAME"
PROMPT_FILE="$PROJECT_DIR/PROMPT.md"
PRD_FILE="$PROJECT_DIR/PRD.json"
LOG_FILE="$PROJECT_DIR/ralph-loop.log"

# Check project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${RED}Error: Project directory not found: $PROJECT_DIR${NC}"
  exit 1
fi

# Check PROMPT.md exists
if [ ! -f "$PROMPT_FILE" ]; then
  echo -e "${RED}Error: PROMPT.md not found at $PROMPT_FILE${NC}"
  exit 1
fi

# Read completion promise from PRD.json (or use default)
if [ -f "$PRD_FILE" ]; then
  COMPLETION_PROMISE=$(jq -r '.completion_promise // "COMPLETE"' "$PRD_FILE" 2>/dev/null || echo "COMPLETE")
else
  COMPLETION_PROMISE="COMPLETE"
fi

# Read the prompt content
PROMPT_CONTENT=$(cat "$PROMPT_FILE")

echo -e "${BLUE}=== Ralph Loop Starting ===${NC}"
echo -e "Project: ${GREEN}$PROJECT_NAME${NC}"
echo -e "Max Iterations: ${YELLOW}$MAX_ITERATIONS${NC}"
echo -e "Completion Signal: ${GREEN}<promise>$COMPLETION_PROMISE</promise>${NC}"
echo -e "Log File: $LOG_FILE"
echo -e "Mode: ${YELLOW}Autonomous (permissions bypassed)${NC}"
echo -e "${BLUE}============================${NC}"
echo ""

# Initialize log file
echo "=== Ralph Loop Session Started ===" >> "$LOG_FILE"
echo "Time: $(date)" >> "$LOG_FILE"
echo "Project: $PROJECT_NAME" >> "$LOG_FILE"
echo "Max Iterations: $MAX_ITERATIONS" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

iteration=0
while [ $iteration -lt $MAX_ITERATIONS ]; do
  iteration=$((iteration + 1))
  echo ""
  echo -e "${YELLOW}[Iteration $iteration/$MAX_ITERATIONS]${NC} $(date '+%Y-%m-%d %H:%M:%S')"
  echo "Running Claude Code..."

  # Run claude with the prompt and capture output
  # Using -p (print mode) for non-interactive execution
  # Using --dangerously-skip-permissions for autonomous operation (no permission prompts)
  OUTPUT=$(claude -p --dangerously-skip-permissions "$PROMPT_CONTENT" 2>&1) || true

  # Log the iteration output
  echo "========================================" >> "$LOG_FILE"
  echo "--- Iteration $iteration --- $(date)" >> "$LOG_FILE"
  echo "========================================" >> "$LOG_FILE"
  echo "$OUTPUT" >> "$LOG_FILE"
  echo "" >> "$LOG_FILE"

  # Show abbreviated output
  echo "$OUTPUT" | head -20
  if [ $(echo "$OUTPUT" | wc -l) -gt 20 ]; then
    echo "... (truncated, see $LOG_FILE for full output)"
  fi

  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>$COMPLETION_PROMISE</promise>"; then
    echo ""
    echo -e "${GREEN}=== COMPLETION SIGNAL DETECTED ===${NC}"
    echo -e "Ralph Loop finished successfully after ${GREEN}$iteration${NC} iterations"
    echo "" >> "$LOG_FILE"
    echo "=== COMPLETED ===" >> "$LOG_FILE"
    exit 0
  fi

  # Check for common error patterns
  if echo "$OUTPUT" | grep -qi "rate limit\|too many requests"; then
    echo -e "${YELLOW}Rate limit detected. Waiting 60 seconds...${NC}"
    sleep 60
  else
    # Small delay between iterations to avoid hammering API
    sleep 3
  fi
done

echo ""
echo -e "${RED}=== MAX ITERATIONS REACHED ===${NC}"
echo "Stopped after $MAX_ITERATIONS iterations without completion signal"
echo "Check $LOG_FILE for details"
echo "" >> "$LOG_FILE"
echo "=== STOPPED: Max iterations reached ===" >> "$LOG_FILE"
exit 1
