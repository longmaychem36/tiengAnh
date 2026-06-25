# 4.4. Sequence diagrams for core features

This folder contains Mermaid sources and rendered assets for section 4.4 of `bao_cao_PhamPhiLong_2211074.docx`.

The diagrams use one shared `React Frontend` lifeline for frontend behavior and one shared `Node.js/Express Backend` lifeline for backend behavior. Technologies outside React and Node are kept separate, including PostgreSQL, Flask Whisper, NVIDIA LLM and SePay.

Files:

1. `4_4_1_login_get_me.mmd` - JWT login and current user retrieval.
2. `4_4_2_onboarding_placement.mmd` - Onboarding and placement test.
3. `4_4_3_receptive_learning_progress.mmd` - Listening, Reading and Writing lesson progress.
4. `4_4_4_speaking_whisper.mmd` - Speaking pronunciation analysis with Whisper.
5. `4_4_5_speaking_ai_plus.mmd` - Plus personalized Speaking lesson generation with NVIDIA LLM.
6. `4_4_6_writing_ai_feedback.mmd` - Writing answer checking with similarity and NVIDIA LLM feedback.
7. `4_4_7_billing_sepay_plus.mmd` - Plus upgrade through SePay.
8. `4_4_8_admin_crud_content.mmd` - Admin CRUD for content and accounts.
9. `4_4_9_minigame.mmd` - Mini-game scoring, stars, progress and EXP.
10. `4_4_10_daily_tasks_auto_complete.mmd` - Daily task generation and automatic completion.

Render example:

```powershell
npx -y @mermaid-js/mermaid-cli -i baocao/sequence_diagrams_4_4/4_4_1_login_get_me.mmd -o baocao/sequence_diagrams_4_4/4_4_1_login_get_me.svg -b white
```
