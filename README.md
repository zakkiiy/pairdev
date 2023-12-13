# graduation_exam

## 画面遷移図
https://www.figma.com/file/kSQhj82GR1bGsYK19OEChj/%E3%83%81%E3%83%BC%E3%83%A0%E9%96%8B%E7%99%BA%E5%8B%9F%E9%9B%86%E3%82%A2%E3%83%97%E3%83%AA?type=design&node-id=0-1&mode=design&t=0K9Rq6hdFPEHry2m-0

## ER図
```mermaid
erDiagram
Users ||--|| Profiles : has
Users ||--o{ Posts : creates
Posts ||--o{ PostTags : places
Tags ||--o{ PostTags : places
Posts ||--|| Rooms : has
Rooms ||--o{ Messages : contains
Users ||--o{ Messages : sends
Users ||--o{ RoomUsers : in
Rooms ||--o{ RoomUsers : joins

Users {
	bigint id PK
	string github_name
  string avatar_url
  string provider
  string uid
  string line_user_id
  datetime created_at
  datetime updated_at
}

Profiles {
	bigint id PK
	bigint user_id FK
  string local_name
  string gender
  bigint age
  bigint experience
  text description
	datetime created_at
  datetime updated_at
}

Posts {
	bigint id PK
  bigint user_id FK
	string title
	string category
	datetime start_date
  datetime end_date
	bigint recruiting_count
	text description
  datetime created_at
  datetime updated_at
}

Tags {
	bigint id PK
  string name
  datetime created_at
  datetime updated_at
}

PostTags {
  bigint id PK
	bigint post_id FK
	bigint tag_id FK  
	datetime created_at
	datetime updated_at
}

Rooms {
	bigint id PK
  bigint post_id FK
	datetime created_at
	datetime updated_at
}

Messages {
	bigint id PK
  bigint user_id FK
  bigint room_id FK
	text content
	datetime created_at
	datetime updated_at
}

RoomUsers {
	bigint id PK
	bigint user_id FK
	bigint room_id FK
	datetime created_at
	datetime updated_at
}
```

## ■ サービス概要
- チーム開発を経験したい人を募集できるサービス
- ただただ募集をするだけではなく、参加へのハードルを下げる仕組みも提供。参加への第一歩の負担を軽減する。
- チーム開発だけではなく「ペアプログラミング」やチーム開発に必須な「GitHub-Flow」等の募集もできるようにする。　

## ■ このサービスへの思い・作りたい理由
### 転職市場におけるチーム開発フローの需要の高まり
- 近年、転職市場では「チーム開発フロー」の経験がより一層重視されています。しかしながら、このような経験を始めるまでのハードルは依然として高く、メンバーを集めることや実際に参加することの両方が困難であると多くの人が感じています。
### ハードルが高いと感じる主な理由
- 時間の不一致、役割の不明確さ、理解度の不安、自己能力への不信感などが挙げられます。これらは、「他人に迷惑をかけるのでは」という心理的なハードルと密接に関連していると思われます。
- そもそもチーム開発専用の募集プラットフォームが不足しており、Twitterやマタモでの募集では、詳細な情報が不足していることも多く、参加を躊躇することが多いように見受けられます。私自身RUNTEQ祭でチーム開発を経験しましたが、Twitterで募集しているのを見かけた際に詳細な部分の記載がなかったため迷いに迷った経験があります。
### チーム開発をするきっかけが少ない
- RUNTEQ祭のようなイベントがない場合、チーム開発の募集がほとんど行われません。また、イベント期間中が入学から間もない時期や開発フェーズと重なると、参加することが難しくなります。
### 「話を聞くだけ」のハードルを下げる
- チーム開発に関する情報を聞きたいが、実際に参加することへの不安も大きいという人が多いです。このため、当アプリでは、実際にプロジェクトに参加する前に「話を聞くだけ」の機会を提供し、そのハードルも下げます。ユーザーは、興味のあるプロジェクトについて、気軽に情報を得ることができ、参加への決断を容易にすることができます。
- 部屋に入ってひとまずチャットで話をするだけでも、しないよりかはチーム開発への具体的なイメージがつきやすと思われるため、その機会を増やすことができればと考えております。
### サービス提供の動機
- 以上で述べたとおり、転職市場でのチーム開発経験の必要性と、参加への心理的ハードルの高さが課題として存在しています。自身もまた、情報不足や不安から参加を躊躇する場面が多々あった経験があります。そこで、気軽に情報交換や交流ができるプラットフォームがあれば、参加への敷居が下がるのではないかと考えました。また、プラットフォームを用意することで、イベントなど関係なくチーム開発をするきっかけになるかと考えております。本サービスを通じて、チーム開発への「第一歩を踏み出す」きっかけづくりとなればと思いこのアプリを考案いたしました。

### ■ ペアプログラミングとGitHub-Flowについての補足。
チーム開発募集だけでは母数自体は少ないと考えているため、ペアプログラミングやGitHub-Flowなどの複数人必要な募集項目を取り入れることで、ユーザーを増やしたいと考えております。
### ペアプログラミングについて。
- 今振り返って思うことは、Rails基礎あたりでペアプログラミングを取り入れることによって、Railsの知識がより深く理解できたのではないかという後悔がありました。例えば、ここで使用しているメソッドの意味なども一緒に考えることで理解の深まりであったり、新しい観点での知識を得られる可能性があると思い導入を考えております。
### GitHub-Flowについて。
- チーム開発では必須のスキルになるかと思います。チーム開発とはいかなくてもGitHub-Flowを経験したい人も少なからずいるので、そういった募集要項も増やせればと考えております。

## ■ ユーザー層について
- RUNTEQ生
  - RUNTEQ生と外部ユーザーが一緒にチーム開発をすることには、安全性の観点からある程度のリスクが存在する可能性があるため、当面はRUNTEQ生向けのみを対象としたサービス展開を考えていきたいと思います。
  - Githubログインを必須として、Organizationsを利用したRUNTEQ生のみ入室可能なルームの作成を考えております。
- チーム開発を経験したい人
- チーム開発へのハードルの高さが原因で参加に躊躇している人
- ペアプログラミングをしたい人

## ■ サービスの利用イメージ
- ユーザーは条件（カリキュラムの進捗度や集まれる時間帯等）を指定して、チーム開発募集の掲示板を登録する。
- 登録と同時に部屋が立てられ、ユーザーには新規募集が登録された旨のLINEを通知する。
- ユーザーは気になった部屋に参加することができ、リアルタイムチャットでやりとりをすることができる。
  - 人数制限は指定できるもののオープンな部屋のため誰でも閲覧は可能とする。そのため参加(制限時には非活性化)と閲覧ボタンを用意する予定。
- 入室=承諾ではないため、気軽に募集要項について質問をすることができる。
- あくまで募集がメインとなるため、その後の活動についてはDiscoro等を使用してもらう。
- 懸念点としては、チーム開発をしたものの失敗してしまう可能性があるため、チーム開発の心得や参考になるQiita資料などを用意しておく必要があると考えております。

## ■ ユーザーの獲得について
MattermostやXでの宣伝。

## ■ サービスの差別化ポイント・推しポイント
- チーム開発に特化した募集サービスは検索した感じでは無いように見えます。
- 単に募集掲示板を提供するだけでなく、参加への心理的ハードルを下げられるようにしました。
- Twitterやマタモでチーム開発の募集を見かけることはありますが、そうした募集には詳細な情報が不足していることが多く、これが参加を決断する上でのハードルとなっています。このアプリを利用することで、募集に関する詳細情報が充実するため、参加を考える側にとってのハードルが低くなります。また、募集を行う側も、より多くの情報を提供することが求められるため、参加者を集めやすくなります。このアプリを通じて、チーム開発への参加がよりアクセスしやすくなればと考えております。ひとまず部屋に入って話だけでもの機会を増やせればと考えております。

## ■ 機能候補
### MVPリリース
- トップページ
- 新規登録機能
  - GitHub
- ログイン機能
  - GitHub
- プロフィール機能（編集）
- 募集一覧
- 募集登録/部屋自動作成
- 募集詳細
- 募集編集
- 募集削除
- 部屋でのリアルタイムチャット（ActionCable）
- X共有機能
- QiitaAPIでの記事取得

### 本リリース
- Line通知機能
- タグ（登録、削除、編集）
- お気に入り機能
- RSpec(テスト)
- マークダウン
- 検索機能
- お気に入り一覧
- 自身の部屋作成一覧
- 自身の部屋参加一覧

### 機能の実装方針予定
フロントエンド：Next.js  
バックエンド：Ruby on Rails  
デプロイ：Render,Vercel  
