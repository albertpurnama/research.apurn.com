[[Email Segmentation]]

## Typedream Implementation

[[Email Warm Up]]


### [[Email Metrics & Deliverability]]

We probably want to use AWS SNS to subscribe to email events. Then record it in our database.
https://docs.aws.amazon.com/ses/latest/dg/working-with-event-data.html



TODOs:
- [x] Figure out whether the JS that's sent downstream actually is different for complicated page vs regular page
- [x] Add custom domain to email sending.

### Good email examples
https://mail.google.com/mail/u/1/#inbox/FMfcgzGtwCsLbtZxmCPcBdVpwSJmVqKn
Email from convertkit, it is responsive.

## Subscribers

### Convertkit
- The emails sent need to have unsubscribe link for users to unsubscribe
- A single account has a total lifetime subscriber.
	- Subscribers have unique emails:
		- Whenever we import the sub with same email but different name, it gets updated.
- What happens when unsubscribe?
	- Subscriber gets removed from total sub list

### Outseta


### Podia


### Gumroad



## Custom domain

https://resend.com/blog/new-domain-verification-experience
- Region domain sending, why is this necessary?


https://www.youtube.com/watch?v=-Wtkl1bGgpA
![[Screenshot from 2023-07-07 17-06-44.png]]

Link branding.... Email sending?


https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-list-dns-records
Can add DNS records in cloudflare, maybe oauth into cloudflare so we can manage the user's DNS easily? Does Godaddy have it?


### SPF and DKIM
https://woodpecker.co/blog/spf-dkim/


### Beehiv pricing
Unlimited Sending???
Amazon SES is quite expensive. (250k emails $25)

----
See netflix's email. it focuses on mobile first. https://mail.google.com/mail/u/1/#inbox/FMfcgzGsmqxlpmzpzPkmPVTZFHzVtbzp (on albert@typedream.com)
![[Screenshot from 2023-05-29 23-35-58.png]]

----


MJML -> responsive email framework https://www.google.com/search?q=mjml&oq=mjml&aqs=chrome..69i57j0i67i650l5j0i20i263i512j0i67i650l2j0i512.1367j0j7&sourceid=chrome&ie=UTF-8

Specifically you can use mjml2html https://documentation.mjml.io/#using-mjml-in-json


Mailjet 
key 4461e9641e1e99d93c9e56a0b2044317
sec 267b281c0412a515d7c2e2bebd6864e5

----
Crazy pricing for emails - https://www.litmus.com/pricing/

