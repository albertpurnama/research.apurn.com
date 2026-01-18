Architecture overview:
- Motorhead for memory management
- Langchain for agents execution
- Langfuse for observability

Things needed to be understood:
1. How can we deploy motorhead near to the API server so it can grab the chat history very fast?

# Multi-model system
We're trying to make our system able to use different models for different chat environment.
How do we make things multi-modal?

Database modeling:
1. LLM
	1. Definition: The large language model, sort of the brain of an agent. Capable of receiving an input and producing an output.
2. Agents 
	1. Definition: The smallest stateless unit of LLM capable of handling a single user query.
3. Memory
	1. Definition: The storage/state system for the agents.
4. Tools
	1. Definition: A piece of code with instructions that is compatible to be used by the agent.
5. Datasource
	1. Definition: A collection of pieces of information that the agents can use in handling a user query.
6. Workflow
	1. Definition:
	2. Questions:
		1. Do we need workflow? can agents be workflow? for example, can we have an agent that defines the next step of the conversation? sort of the mistral 8x7b architecture (see [[meta-mixtral-8x7b.excalidraw]]) .


