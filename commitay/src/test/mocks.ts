
export const gitDiffMock = `
diff --git a/src/commitay/src/lib/ia-clients.service.ts b/src/commitay/src/lib/ia-clients.service.ts
index 43b639f..097255e 100644
--- a/src/commitay/src/lib/ia-clients.service.ts
+++ b/src/commitay/src/lib/ia-clients.service.ts
@@ -29,8 +29,8 @@ export namespace AIClients {
     private IA_MODEL = 'gemini-pro'; // alias to gemini-1.0-pro
     private openai: OpenAI;
 
-    constructor(private apikey: string) {
-      this.openai = new OpenAI({ apiKey: apikey, });
+    constructor(private apiKey: string) {
+      this.openai = new OpenAI({ apiKey });
     }
 
     async prompt (userPrompt: IGenerateCommitInput): Promise<IGenerateCommitOutput> {

`;