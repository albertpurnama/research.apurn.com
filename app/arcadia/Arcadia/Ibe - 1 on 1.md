
#### Oct 24th, 2023

PR reviews still very slow, slowing everything down.
a couple of edge cases that we haven't checked on the coupon code.


#### June 12th, 2023



#### May 15th, 2023

Feedback on the product management:
1. Sebelum di code, lock the features description first.
	1. Make it more specifics: in navbar example, we can specify each individual components.


Encountering new stuff, how do we develop fast?
- Monorepo package transpile, bakal bikin berat in the future.
- Event emitter, xstate, is good in `dream-editor`
	- But, our way to develop stuff right now, doesn't guarantee that it's going to be tested.
	- Testing framework?
- Styling library: we're still using too many libraries.
- 



#### April 17th, 2023

- Can I get feedback on the meeting for task distribution with Bayu?
	- In terms of usefulness,
	- In terms of conciseness (are we wasting time?)
	- Suggestions for next? should we do more? do less?
- Career growth questions:
	- Do you find value in your Typedream work? Do you find your work valuable? Do you know why you're doing what you're doing?
	- Do you think you're growing in Typedream? Are you progressing career-wise by building Typedream? Why or why not?



#### April 10th, 2023

Documentation:
- DnD documentation berguna.
	- The list of components is pretty good.
	- Code references work well.
	- link to react-dnd works.

- In code comments are helpful.
- Emitter is a very good pattern.
- Code readability comments

Productivity rate:
- Kurang cepet, adaptasi dengan AI agak cepet di twitter.
- Feedback dari user -> time to implement kurang cepet
- Relative to RG:
	- Depending on the team. Lebih cepet dari 2 team di RG

Things to work on:
- Folder structure works differently from one repository to another repository.
- 

What hits the productivity:
- `DreamEditor` is complex, so it's kinda slow.

Yang khawatirkan:
- Ketemu temen yang masih kerja di industri yang affected by AI.
	- ^ too slow to adapt to new tech.




#### March 27th, 2023

- Ngoprek AI stuff
- Suka Hackathon

Learning vs Shipping:
- Stop doing side projects
- Jangan sampe kerjain side project sampe gak learn apa"
- A principal engineer is a friend, so can give feedback.



#### March 19th, 2023

- Skipped the previous 1:1
- Rasanya gak beres beres, bikin risih.
- Nyicil belajar backend.
- Interested a bit of AI,
- Balik ke figma generator

Jangan tanya terus cuk, make decision first, then ask feedback.



#### March 6th, 2023

- Talk about liverpool match
	- Back nya liverpool suka open, gak dijaga sama MU
- Weekend nginep
- Ngoprek backend (next), iOS

- Ngoprek tergantung interest.
	- bukan berarti yang sebelumnya ditinggalin
- Previous oprekan:
	- Monorepo.
	- Figma.
	- iOS stuff now.
- Ibe juga ga merasa oprekan gak harus selalu masuk ke production.

Minggu lalu, sejam-2 jam sempet frustasi:
- Project navbar berasa susah banget maju nya.
- Dropdown beda banget, lebih complex dari yang Ibe kira
- Ngatur behavior dari component dan toolbarnya
- Waktu yang dibutuhin lebih banyak dari yang diperkirakan.

CSS variables udah oke gara" bantuan oprekan di repo experimental



#### February 27, 2023

- Talk about marriage stuff.
- Talk about his ex, 24/7
- Ridho langsung tanya ke Ibe, v good.


#### February 22, 2023

- Talk about football.
- Hobby: like to question stuff

- Bikin target per 3 bulan:
	- Bakal lebih fokus waktu ngoprek, kadang agak kehilangan arah akhirnya.
	- Pernah nanya tentang testing to me
		- Maybe test transformers?
		- Kesempatan buat belajar bikin environment test.
	- Focus to tooling, monorepo, config, etc.

Happy Hour
- Bonding perlu, tapi gak perlu sampe dedicated hour. Ngobrol itu happens waktu gak direncanakan

#### February 13th, 2023

- Happy someone (Resi) joins the team.
- Interested in education, try to educate.
	- Educate people that haven't really touched tech.
- How do you test?
	- Sering minta feedback from friends.
- Universitas Merdeka, ngajar frontend. Join lembaga ngajar.
	- Ngajar sebuah kelas.
	- Discord is used in universities.
	- Basic HTML, CSS, JS
	- Langsung loncat ke bootstrap.

Feeling Happy, BUT belum ada feedback lagi untuk hal yang bisa di-improve.
Ridho ngoprek Rust.

Masih coba nyesuain diri untuk learn new stuff and focus on the task at hand.

Harus ngajak yang lain untuk discuss the differences between solutions.

Being a manager that has no strong opinion:
- Untuk mau belajar is very good, can TRUST the team.
- Critical thinking is very good.

A manager that isn't strong in (is bad):
- Management
- Technical

Remind the team that tomorrow's retro is NOT going to be a place for managers or peers to blame each other for not finishing some task.

Masih ngerasa agak gatel di monorepo things. Package based monorepo is fine, but how do we make it better?



#### February 6th, 2023

Baru gunting rambut lol

1. Context (knowledge of the database) vs fundamental skills (coding practices, React fundamentals, etc)
	1. Tidak berlawanan, utamain fundamental skills, baru context, baru berdampingan.
	2. Waktu di Toko Crypto, no React experience. Because the background is computer science, it's easier to understand the context.
	3. Some doesn't really have fundamental skills.
	4. Domain-specific cons:
		1. There's a cap to where he can improve: for example, 1 person expert in web performance, but not in features so he feels like he's not really a senior.
	5. Rotasi team, so some people might work in X and Y.
2. What do you think went well (and hell) with moving Navbar over to dream-editor.
	1. Went Hell:
		1. Task quite challenging (positive). 1 to 1.5 weeks just learning stuff. Ada cycle for learning and cycle for shipping.
		2. Some documented well, some not. `dream-editor` tidier than `app/editor`. 
	2. Went well:
		1. in `dream-editor` if you work on A you can be sure you will not interfere with B
		2. Banyak dibantu mahamin context, 1:1 is very important, very fast to learn how things work, idea validation is good.
		3. How he learns fits into how the editor.
		4. Can experiment in the editor with `xstate`. He doesn't need a quick yes, but needs validation to the ideas.
3. Suggestions on what stuff to do (or hack) together (the whole engineering team).
	1. Improvement on developer experience, for example: non-transpiled module.
	2. Storybook for component catalog.
	3. Testing automation


**For theming**
- Needs design system before doing it?
- Standardization of:
	- Design tokens -> Alias token
- 

Node in `dream-editor` and node in 

#### Jan 30th 2023

- onClick outside in iframe doesn't really work
- Outdoor biasa ada side project going on
- Figma Typedream
	- svgr - hast to babel

Peer performance review doesn't work if it's not in the same project

Ada orang estonia connect with him on Typedream asking for availability.

I ask Ibe to think about what part of the code needs improvement.

https://amzn.github.io/style-dictionary/#/ -> generate design "contract"
https://vanilla-extract.style/documentation/packages/recipes/


#### Jan 23th 2023

- Weekend ngoprek yang ditugasin.
- Udah tau gimana caranya monorepo kerja, how each components work together.

Udah mulai bilang ke temen". 
So far happy working here.
Jokes nyambung, di tempat lama jokesnya gak nyambung.

Disclaimer: Kalo ada PR commit malem, itu hal normal buat dia lol.

**Figma ke Typedream.**
- Ngecek builder.io buat research
- Buka" plugin builder.io

Plasmic paling bagus figma integrationnya

Belom gitu tertarik sama AI stuff. Masih interested di tooling buat Typedream.
Advanced image/video compression in Typedream/Dumplink?

Bayangin user typedream nanti banyak gunain gambar.
Mereka gak ngerti size image yang di upload.

Infrastructure cost after a couple of iteration.

**Learning material:**
- JustJavascript

**Frontend sharing session**
- Kalo ngumpul kita gatau ngapain -> awkward
- Share findings (technical or non-technical)

**Feedback meeting performance**
- Overall very good, learn something new
- 

#### Jan 15th 2023

**Navbar plan**
- Move navbar first then try to decide whether we want to improve on it.

**Things that we can improve on the navbar planning**
- Harus tau kapan ngasih tau progress,
- Harus kabarin kalo ada masalah,

**Improving the development server**
- Kalo ada waktu kosong, dipake buat bantu temen, atau oprek something.
- Penasaran banget kenapa harus transpile the code during dev.

**Team**
- Mulai nyaman dengan cara kerja kita
- Topik random which is very good

- Diluar Typedream, selain ngoprek typedream, banyak suka productivity/platform(?). 
- Productivity tools: such as the things we improve on the development server
- CLI generator to add new plugins.

**Life**
- Pamer ke cewenya dia about gathertown lol, pretty fun
- He really likes the vibe.


#### Jan 8th 2023

**Learning Style:**
- If a library, from the documentation:
	- Explain concept first, then technical
	- or Tutorial
	- Lebih enak baca code daripada documentation if the docs doesn't exist.
- Documentation not really clear in existing monorepo
- Create mapping. Dicatet dengan jelas. Diagrams.

**What can I do as Manager?**
- Frequent validation (every week).
- Learning material
	- O'Reilly
	- Frontend master.
- Give time.

Sekarang pake neovim, sekarang lagi pake vscode.
TokoCrypto pake VSCode, no eslint so gg.
RecentML di RG, ganti jadi Neovim.
Belajar pake Turbo, yarn workspace, pake NX dulu.

**Discussion with Ridho & Steve**
- **Circular dependency** might affect the dev performance.
- Not familiar with the tools. **Turborepo**, **yarn workspaces**.
- **Styling issues**:
	- Steve: `editor` need dynamic styling, repot pake css modules. Want to try using emotion
	- Opinion on `vanilla-extract` on Steve Ridho:
		- Dynamic -> emotionJS win.
		- Need contract(??)
		- Editor emotionJS, Renderer `vanilla-extract`?


Currently run: doppler run -- yarn dev-editor

Tamagui pake workspace juga.

------

Answer his questions first.
Show him around gather town.

Focus time: subuh

Regular sharing session with the team.
How frequent? Seminggu sekali. Tergantung seberapa deep materi nya

Structure and non-structure the same.

**What is his goals?**
- Want to be a senior. Need to know requirements.
- Want to contribute by implementing outside understanding.

**What drives Ibe?**
- Understanding something.
- Curious.