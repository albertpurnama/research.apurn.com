
We probably want to use AWS SNS to subscribe to email events. Then record it in our database.
https://docs.aws.amazon.com/ses/latest/dg/working-with-event-data.html

How?
- Use Cloudwatch, but it requires creating configuration set.

Interpreting AWS SNS Data, there are a couple of types:
`Bounce`, `Complaint`, `Delivery`, `Send`, `Reject`, `Open`, `Click`, `Rendering Failure`, `DeliveryDelay`, or `Subscription`

See what these types mean:
https://docs.aws.amazon.com/ses/latest/dg/event-publishing-retrieving-sns-contents.html

The general overview:
1. AWS SES sends the email
2. AWS SNS receives events from AWS SES regarding the sent email (with data types listed above)
3. Typedream Backend listen to AWS SNS topic on (2)
4. Typedream Backend process the data, and increment metrics of related email delivery stats in the main database
5. Typedream Backend saves the SNS event content


### Configuration set

What is configuration set?


## Email tracking

https://docs.aws.amazon.com/ses/latest/dg/configure-custom-open-click-domains.html
> By default, this pixel is inserted at the bottom of the email; however, some email providers’ applications truncate the preview of an email when it exceeds a certain size and may provide a link to view the remainder of the message. In this scenario, the SES pixel tracking image does not load and will throw off the open rates you’re trying to track. To get around this, you can optionally place the pixel at the beginning of the email, or anywhere else, by inserting the `{{ses:openTracker}}` placeholder into the email body. Once SES receives the message with the placeholder, it will be replaced with open tracking pixel image. Just add one placeholder, as only the first occurrence will be replaced, any remaining will be omitted.


https://ci5.googleusercontent.com/proxy/F7kFaLGylPNgVZPYpUI3wv2YYq4BdFFiVBqJx8UKs1HUPTVQPqBuOgBQIHV7F5h4GicaCnYR6XKBUKLqSAl7me9kKbfNsJkJGEMUzZSDlsHIeFQDQcuPNbcOJE_K1X2zRCGLqY02g_jjEBuALmJOUXSUQ6v3dyoJMn8Ovv1PMrvcij5ftuqSVscZqrPC2gctOPq2woVsf6_TRg=s0-d-e1-ft

https://ci6.googleusercontent.com/proxy/IHwLizsi30CLaDRo6nKVZYcwDdTK7kFmk-0Rf78L3Qq55PUIJgWUP2JofGajksT_gmVM92lruFbHTebXsAFY7l2HqCFBgGfmljukG9AaahPUoUm16X9PEKe8LCEVEpTSKURy1a5B2HDQpYChHgy_1aW9mtwC11cNc-DawXGap9xhUi8Bz1C7D1-YsDe9htaIIT3O9WLKbb_z0A=s0-d-e1-ft


**Loops uses their own tracking**
- http://c.vialoops.com/CI0/01000189d72b162f-0f38a404-ecf6-486e-a8d4-f8a05e09e897-000000/gBHIukZFmybsxG7uq7O2Tho2u6U8hvXhbGM3l-b9KMs=313
- http://c.vialoops.com/CI0/01000189d72b13f5-fbf29a35-9a16-4d17-a185-9dd587f919bb-000000/-PdL-BEWKv0XV2E4v3YVFFQyxquY4-ODkVAXpqCwyB0=313

http://c.vialoops.com/CI0/01000187c373bb0c-1c6f7f15-=4bf0-4351-9bf0-7f4bf844796b-000000/Nl_B3m6sCiBcY-8N0bJVosTAMCk-y7jxuLgm3fzK=
Yy0=3D298


Notes on Loops tracking:
- They don't have tracking in the preview emails

seems like there's no direct correlation from the loops URL to the IDs.
- emailMessageId = cll2ugfev0039l40o94mftuv5


**Beehiiv**
True email
- http://link.mail.beehiiv.com/ss/o/_3iXq-h705EJuVmikmg72w/3yd/qxr_y3=MITCOuDRyhay-Vnw/ho.gif

Test email does have tracking associated (http://link.mail.beehiiv.com/ss/o/_3iXq-h705EJuVmikmg72w/3xs/rujwHrtXT-CRK4toWIuXOQ/ho.gif)

Doesn't seem to have a correlation between the url <> user, email, campaign ids.


**Convertkit**
https://open.convertkit-mail2.com/38umxn6293skho4z69vfrh5655onn=



#### Email Tracking Open pseudocode
- on campaign start,
- create new metric id
	- Prerequisite: metric table in the database
		- Schema: id, collection_item_id, simple columns (open count, click count, hard bounce, Soft Bounce, complaint/reported spam)
- fill metric id in mail request (EmailSQSMessage)
	- or can it be in the form of space_id and collection_item_id pair instead of creating new id?
