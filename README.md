
# feedback around
社内でのプレゼンテーションの評価をし合うためのアプリケーションです。

# DEMO
 ## 機能一覧
  | 画面を開ける人  | 画面名 | 機能概要 |
  | ------------- | ------------- | ------------- |
  | 全員  | 共通レイアウト  |  ログイン状態を確認できる |
  |   |   |  サイドバーで選択したリンクに応じた画面に遷移 |
  |   |   |  全プレゼンテーション一覧を表示する |
  |   |   |  削除確認のポップアップを表示できる |
  |   |   | 処理の結果のスナックバーを表示できる  |
  |   |   |  サイドバーで選択したリンクに応じた画面に遷移 |
  |   | ログイン  | googleログインで認証できる  |
  | 管理者画面のみ  | 管理者設定タブ選択画面  |  タブで選択したリンクに応じた画面を表示する |
  |   |  ユーザ設定画面 |  ユーザーを一覧表示・更新・検索できる |
  |   |   | ランクを一覧で表示できる  |
  |   | 職種設定画面  | 職種を一覧表示・登録・更新・削除・検索できる  |
  |   | ランク設定画面  | ランクを一覧表示・登録・更新・削除・検索できる  |
  |   |   |  職務を一覧表示できる  |
  |   | 評価設定画面  | 評価基準大分類を一覧表示・登録・更新・削除できる   |
  |   |   | 評価基準中分類を一覧表示・登録・更新・削除できる  |
  |   |   | 評価基準中分類ランクを一覧表示・登録・更新できる  |
  |   |   | 職務を一覧表示できる  |
  |   | プレゼンテーション設定画面  | プレゼンテーションを一覧表示・登録・更新・削除・検索できる  |
  |   |   | ユーザーを一覧表示できる  |
  |   |   |  参加者を登録・更新・削除・検索できる |
  | 全員  | プレゼンテーションタブ選択画面  | タブで選択したリンクに応じた画面を表示する  |
  |   | 評価参照画面  | 自己評価・他者評価・メンバーフィードバックを一覧表示する  |
  |   |   | 評価基準中分類ランクの詳細が一覧で見れる  |
  |   | 自己評価入力画面  | ユーザーの職務に合わせた入力フォームが表示される  |
  |   |   | 自己評価の入力済みのデータがあれば表示させ、登録・編集ができる  |
  |   | 評価者評価入力画面  | 評価対象者を一覧表示・検索できる  |
  |   |   | 入力済みの自己評価・他者評価・メンバーフィードバックを一覧表示する  |
  |   |   | 【入力期間中のみ】 評価を登録・編集ができる  |
  |   |   | 【閲覧期間中のみ】 評価基準中分類ランクの詳細が一覧で見れる |
  |   | フィードバック入力画面  | 参加者を一覧表示・検索できる  |
  |   |   | 入力したフィードバックが一覧で見れる  |
  |   |   |  【入力期間中のみ】 フィードバックを登録・編集ができる |
  
# 画面キャプチャ

## ランク設定画面の例 
 ![image](https://user-images.githubusercontent.com/64944011/99029840-e0c1b980-25b6-11eb-840f-4594ea580113.png)
![image](https://user-images.githubusercontent.com/64944011/99029852-e7e8c780-25b6-11eb-82fc-ddc66ba43c7b.png)

## 自己評価入力画面の例 
![image](https://user-images.githubusercontent.com/64944011/99031311-216f0200-25ba-11eb-9ca1-0b65b89db9da.png)
![image](https://user-images.githubusercontent.com/64944011/99031063-78c0a280-25b9-11eb-9398-98ff131563f7.png)

 
# Requirement

* Node.js v12.18.0
* nuxt/cli v2.14.3
* Ruby Sass 3.7.4

# Installation

## Node.js
https://qiita.com/sansaisoba/items/242a8ba95bf70ba179d3
リンク先の手順で進めていく
 

## Sass
`npm install sass-loader node-sass`
 
# Usage
 
```bash
git clone https://github.com/yuri-nakano/feedback-around.git
npm i
npm run dev
```
 
# Note
 
■API定義：Swagger
【作ったもの】
社内プレゼンを自己評価と評価者評価、360度メンバー評価を元にランクを決定する評価アプリケーション
【担当したこと】
■ビジネス
・議事録作成
・議事進行
・顧客役との調整（機能、UIやスケジュール）
■技術
・管理者画面
	・職務設定画面
	・ランク設定画面
・評価画面
	・評価閲覧画面
	・自己評価入力画面
	・評価者評価画面
【苦労したこと・頑張ったこと】
・画面のデザインも1から作成しお互いが納得いくデザインにするのは時間がかかったが、なるべくシンプルにして見やすさ、入力しやすさを重視しました。
テーブルをv-ifを使って動的に作成するのを体験し、この学習を通してVuetifyフレームワークの便利さを学びました。
・苦労したのは評価画面。まずAPIのネストが深くテストデータを作るのも苦労しましたが、それ以上に取ってきたデータのネストが深いと`v-model`や`value`の指定でデータを取得することができませんでした。またPOSTするデータもネストが深かったため組み立てる部分も苦労しました。1から作ることは想像以上に難しく、いつも使っているサイトやアプリも細部まで拘って作られていることを実感しました。Vuexも初めて使ったので覚えることが多かったが作成が完了したときは大きな達成感を感じることができました。
 
 ※修正中の点がいくつかあるので今後もコードが変わる可能性があります。
