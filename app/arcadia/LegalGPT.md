# Big parts

- Data processing
	- Read data, grab relevant data (legal first and last name, SSN)
	- Vectorize the data, put it on chroma?
- 

### Data processing
use `py-tesseract`

Chain:
1. OCR prompt (maybe this can be anything)
	1. Grab all the information on the image
2. Determine the type of the information
	1. Passport?
	2. EAD?
	3. X, Y, Z
3. Data extraction prompt
4. Model
	1. Given the type, what is the pydantic structured output?

Finally, store in database.

