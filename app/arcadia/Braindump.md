
[[CMS Stabilization Planning]]'s should just be another CMS v0. There's no use in re-working the implementation. Based on the way that we work, I'm the only one against the current belief (doing things the clean way). Better create the new collection, etc.

-----


How do you feel working on Typedream?
Stress for sure, is it a good amount? how to even answer the question? I think to answer the question, everyone needs to be honest and open about their own stress level.

If you're feeling stressed, why are you still working on it?
It's both stressed and a feeling of accomplishment (I don't feel sure when I type *accomplishments*, not sure why).

Why are you not sure about feeling accomplished?
Because I think I'm where I am not because of me, but because of the people I'm with.

Ok, but aren't all people like that? take some of the greatest people you know, they must have people around them supporting them. Bill gates had allen, steve jobs had woz, zuck had saverin. 

But they are all people I don't know. How about the people I know, who's better than I am, who gets to where they are only on their own efforts? 

Let's dive deep:
1. Kevin wouldn't be where he is without me (or putri? why can't you say *me* confidently?)
2. Putri wouldn't be able to do what she does now without me.
3. Michelle wouldn't be here without Kevin, and kevin without me.

However, Michelle never say the things that you say "oh maybe I'm not good enough, etc". Does she think that she's actually good? Kevin also never really look down on himself the way that you do. Why is this the case? Are they delusional? Are they actually better than their average?

I don't know. They have this "fake it till they make it" mentality. Now I'm questioning why this matters at all

Why do you think it doesn't matter?
I can't seem to answer this question.... oh I think it's because it won't make them any better anyway thinking about it. Why do they need to care how good they are compared to the others? They just need to compare it to themselves right? As long as they keep on improving then they're good.


Previously there's a "site_type" added to differentiate between mobile vs desktop sites https://github.com/typedreamhq/cloud/pull/1170, why are you not furious about this change? why only form changes that triggers you?

Made [[Typedream System.canvas]] 


--------

For CMS: we will never in a million years figure out how we're supposed to do CMS. We did CMS knowing that it'll probably be replaced. We had to move fast, create the product, ship the product, then figure out from there.

I don't think I agree with this, I think the mistakes that we made with CMS:
1. Lack of docs.
2. Using bad practice: specifically the way we handle data around the app (both editor and renderer).

Both (1) and (2) we know, (1) have been known longer than (2). But we still choose to ignore these (2)


Regarding adding new type: it's a slippery slope, once we allow introduction of new properties to our core element we will allow many things to happen. Just as an example: Putri said "oh ya adding to the field is fine, adding different property in the field has been done before in PRODUCTS". This isn't a valid argument because products is an MVP product, it was never meant to be built on top of. If you try, it will be another CMS disaster.

So what's the solution? Still don't know.

Questions:
1. Why do we need to have a mini plan?
	1. From the slack discussion on #product it seems like Kevin just isn't sure that people even want to upgrade to pro just to have unlimited form submissions. And the plan is to release 100 forms on mini, WITHOUT differentiating the form in any way.
	2. if people aren't sure that they want to upgrade to pro "just for forms" (what kevin said), then that means we need to add more features to entice these people to upgrade to pro, not introducing another pricing tier "just for newsletter".
2. Should I be thinking more about this? I feel like this decision is too rushed, and there's not enough time for me to be involved in the process as it modifies form (one of our core product)?

From these 2 decisions:
1. MVP products
2. Adding new property to form

The cycle is this:
1. Someone from business side proposes an idea, passes it on to product
2. product thinks its a good idea too! Proceeds to think of the easiest way to push it to production.
3. Thought of a solution (adding type, adding disposable product schema on collection), proposes to me. Then ask, "what do you think?"
4. I think the solution isn't good because it goes against some of fundamental principles
	1. Product: the schema is made based on current condition, it's not clear how we can extend functionality when we want to introduce new pricing model like subscription, or metered payments.
	2. Form type: introducing type will make form more complex, without adding actual value to the form itself, it doesn't add more capabilities, just some way to track pricing.
5. Product then ask, so then how? What's the other solution?
6. I agree to temporary solution.
7. Users use it, found some bugs, engineer(putri) fixes stuff (patch is a more accurate term, because it's temporary solution). Repeat this step numerous times.
8. Bugs shows up on a lot of places, not really sure what the root cause is because of step 7. engineers spent majority of the time figuring out the codebase rather than building or even fixing stuff. Stuff becomes buggy, slow, inconsistent.
9. We arrive at the same exact situation with our legacyEditor and CMS.
10. I raised the issue, oh we have tech debt people, it's slowing us down! Then ask "ok what can be done pe?"
11. I started thinking about how to make the ENTIRE engineering team more productive:
	1. Found reasons why, mostly complexity of the codebase, not enough context
	2. Documentation.
	3. Started fixing stuff (DreamEditor)
12. Then business side: ah shiiit, we got new revelation bois, we should work on feature X instead (go to 1).
	1. But before going to 1, usuallt there's some discussion on: oh shit our shipping speed is very slow ya, how come a feature that simple takes so long to be built? TECH DEBT. NOBODY. IS. REDUCING. TECH. DEBT.



I think this cycle is fine (i have no problem fixing CMS, products, or anything shitty), but I don't think I should be held accountable for:
1. Bugs reported by user
	1. Why? because on step 5-6 there's never enough time for engineers to think about the problem and solution space.
2. Numbers of features that can be shipped.
	1. Why? Because step 10 on the cycle is going to add up, and with more features added, I think it's going to drop.

Initially I think those metrics are fine, but after thinking about this vicious cycle more. I can see that my OKRs will never be satisfied, it's useless OKR because our development cycle above is not geared towards increasing productivity.






----

Kevin usually say: "you can hire sub-par engineers to make simple products"

Typedream is a simple product.

I don't think this is the case, bad engineers = bad product in general. If you can score a product from 1-10 in terms of overall quality: hiring bad engineers results in <5, while good engineers >5.

The difference is that for hard science stuff like AI, <5 quality will never make it to user's hands. On the other hand, <5 quality on easy stuff might make it to the user's hands.

I think the term "you can hire sub-par engineers to make simple products" should be "you can hire sub-par engineers to make **sub-par** simple products".





Hiring more software engineers are only effective if there's streamlined systems that will allow the team to progress according to some boundaries/rules that everyone follows religiously. Otherwise, a lot of time will be spent re-aligning, re-processing stuff.

Hiring founding/product engineers are effective for teams that is still focusing on pushing out MVPs (searching for PMF), not stabilizing existing product.


## form submission limit

On free: 100
On mini, newsletter: unlimited
On mini, other forms: 100
On launch: 100
On pro: unlimited



Engineering can do customer support job,

But customer support can't do engineering's job.

Customer support team doesn't know enough about the product:
1. Animated text incident with mimis, should she know more about the limitation of animated text?

