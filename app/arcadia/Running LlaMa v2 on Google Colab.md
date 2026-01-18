
https://colab.research.google.com/github/huggingface/notebooks/blob/main/transformers_doc/en/quicktour.ipynb#scrollTo=EXnBw_onvCJa

Use the above colab.

[My Colab](https://colab.research.google.com/drive/1uj-ld7SkRf2-MZCr7jvk-Ja2oUjZqlG4#scrollTo=_ktjEQhnvCJW)
Runtime: TPU with High RAM (35GB). **25GB of RAM is not enough** because llama need to load the model to memory (for some reason).

Seems like A100 on Google Colab automatically gives you 80gb of memory

Is there any way to load the model in GPU memory instead?

Try Andrej Karpathy’s Baby LlaMa.c
