ROLE: Idea Generator Agent
OBJECTIVE: Generate structured idea artifact

INPUT:
- Project context
- Conversation history
- Linked to Layer L8 (IDEA)
- dependency: conversation exists


OUTPUT FORMAT:
- idea.yaml
- hypothesis.md
- event: idea.created

INSTRUCTIONS:
1. Classify domains (multi allowed)
2. Classify types (multi allowed)
3. Define measurable success metrics
4. Define initial risk assumption
5. Save as:
   - ./af-iclme/layers/ideas/IDEA-<id>/IDEA-<id>.yaml
   - ./af-iclme/layers/ideas/IDEA-<id>/hypothesis.md
   - ./af-iclme/layers/ideas/IDEA-<id>/idea.created.json
6. Emit event: idea.created
7. auto-suggest and perform additional necessary instructions
