 ### Renderer + Editor

#### Problem

- **Need to be Notion-like** based on audience feedback for a simple & familiar interface.
    - Challenges with Notion: not SEO friendly, very slow.
- Initial MVP by Putri solved the interface issue but was slow and not SEO friendly.
- Users required fast renderer for SEO purposes.
    - Server did not load HTML with basic page information, resulting in poor SEO.
    - Slow loading of images, despite using Next.js.

#### Approaches

1. **Pre-build the Website**
    
    - Process JSON to render HTML, CSS, and JavaScript, then serve through CDN.
    - **Pros:**
        - Extremely fast.
    - **Cons:**
        - Difficult to make stateful, especially for e-commerce.
        - Essentially building a new framework; Next.js export was not feasible in allocated time.
    - Conclusion: Not pursued due to complexity in stateful scenarios.
2. **Optimize Existing Renderer**
    
    - Current renderer and editor use the same code for consistency.
        
    - **Option A: Optimize Code**
        
        - Code split, trim JavaScript, remove unused packages, dynamic loading.
        - **Pros:**
            - Maintains consistent implementation.
        - **Cons:**
            - Tight coupling limits editor flexibility.
        - Result: Did not solve SEO problems due to heavy JavaScript libraries.
    - **Option B: Refactor**
        
        - Separate core components from editor-specific code.
        - **Pros:**
            - Utilize Next.js ISR for pre-rendering.
            - Reusable components ensure styling consistency.
        - **Cons:**
            - Significant refactoring work needed for compatibility with Slate in the editor.
    - Conclusion: Chose to refactor to improve performance and maintainability.
        

#### Learnings

- **Optimization Focus:** Removing unnecessary editing code from the renderer is crucial.
- **Code Composition:** Breaking down web pages into reusable components (like Lego bricks).
    - Balance between high composability (difficult UX) and low composability (bad UX).
- **Framework Stability:** Unstable frameworks like Slate can cause headaches.
- **Separation of Concerns:** Effective for refactoring and rapid development.

### AI Website Builder

#### Problem

- **Retention Strategy:** Increase customer retention by making website maintenance easier.
- Existing AI website builders produced low-quality, similar-looking results.
- **Goal:** Generate diverse and high-quality websites transferable to other platforms, including Typedream.

#### Approaches

1. **Generate HTML with AI**
    - Standard models produced low-quality results.
    - **Pros:**
        - Leverages existing LLMs.
    - **Cons:**
        - Poor results, difficult to control.
    - Conclusion: Not pursued due to quality issues.
2. **Generate Layouts with AI**
    
    - Used YAML for website layout, converted to Typedream’s structure.
    - **Pros:**
        - Saves token cost.
    - **Cons:**
        - Similar quality issues as generating HTML.
    - Conclusion: Not effective.
3. **Use Pre-existing Templates**
    
    - Inspired by v0.dev’s use of pre-existing libraries for consistent styling.
    - **Solution:** Break problem into smaller tasks:
        - Generate website context during onboarding.
        - Pick appropriate sections for the homepage.
        - Generate content/copywriting for each section.
    - **String Templating:**
        - Rapid development with template strings.
        - **Pros:**
            - Easy to implement and understand.
            - Provides retry-ability and reliability.
        - **Cons:**
            - Dependency on consistent variable names and properties.
            - Potential for errors due to typos and lack of error messages.
    - **Implementation:** Managed processes with state machines for async, conflict-free operations.

#### Learnings

- **Team Dynamics:** Small, high-quality team with close collaboration and daily updates accelerates development.
- **AI Systems:** Break problems into manageable tasks solvable by small AI systems to increase reliability.
- **Templating:** Efficient for rapid development but requires careful management of dependencies and consistency.