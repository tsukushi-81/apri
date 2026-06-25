# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

天気・気温・湿度をもとにその日の服装を提案するReact PWA。朝・昼・夜の時間帯別に提案を行い、お気に入り服装をlocalStorageに保存できる。バックエンドなし・クライアントサイドのみ。

## 技術スタック

- **フレームワーク**: React + TypeScript
- **ビルドツール**: Vite + Vite PWA Plugin（Workbox）
- **天気API**: Open-Meteo（APIキー不要・無料） `https://api.open-meteo.com/v1/forecast`
- **位置情報**: Geolocation API（ブラウザ標準）
- **永続化**: localStorage のみ（クラウド同期なし）
- **オフライン対応**: Service Worker + Cache API

## コマンド

プロジェクトがViteで初期化された後の標準コマンド:

```bash
npm install        # 依存関係インストール
npm run dev        # 開発サーバー起動（localhost:5173）
npm run build      # 本番ビルド（dist/）
npm run preview    # ビルド結果のプレビュー
npm run lint       # ESLintの実行
```

テストを追加する場合はVitest推奨（Viteと統合済み）:

```bash
npm run test           # テスト全件実行
npm run test -- path/to/file.test.ts  # 特定ファイルのみ実行
```

## アーキテクチャ

### レイヤー構成

要件定義（README.md）で定義されたクラス設計に従う:

```
UI層 (React Components)
  ↓
Controller層 (WeatherController, FavoriteController)
  ↓
Repository層 (WeatherRepository, FavoriteRepository)
  ↓
Service/Infrastructure層 (WeatherService, LocalStorage, ServiceWorker)
```

### 主要クラスとその役割

| クラス | 役割 |
|--------|------|
| `WeatherService` | Open-Meteo APIへのHTTPリクエスト（緯度・経度を受け取りWeatherDataを返す） |
| `WeatherRepository` | キャッシュ管理（5分TTL）。オンラインならAPI呼び出し、オフラインならSWキャッシュを返す |
| `RecommendationEngine` | `OutfitRule[]`をもとに気温・湿度・天気状態から服装を判定するルールエンジン |
| `FavoriteRepository` | localStorageのCRUDをラップ。`FavoriteOutfit`の保存・取得・削除 |
| `ServiceWorkerManager` | SW登録・更新検知 |
| `InstallPromptManager` | `beforeinstallprompt`イベントを捕捉しA2HSバナーを制御 |

### 服装提案ロジック（重要な設計制約）

`OutfitRule`と`RecommendationEngine`は**独立したファイルに分離**する。UIコンポーネントはルールを直接持たない。閾値（気温・湿度の境界値）は定数として一元管理する。

### キャッシュ戦略（Workbox）

| リソース種別 | 戦略 |
|-------------|------|
| HTML / JS / CSS | Cache First |
| Open-Meteo APIレスポンス | Network First（TTL: 5分） |
| アイコン・画像 | Cache First |

### データフロー（天気取得）

1. `useEffect`でGeolocation API呼び出し → `Location`取得
2. `WeatherRepository.fetchWeather(location)` → SWを経由してOpen-Meteo APIへ
3. オフライン時はSWがキャッシュ済み`WeatherData`を返す（`isCached() = true`でstale表示）
4. `RecommendationEngine.generate(weatherData)` → 朝・昼・夜の`OutfitRecommendation`を生成
5. stateにセットしてUIを更新

### PWA必須ファイル

- `public/manifest.json` — アプリ名・アイコン（192px / 512px）・テーマカラー
- Service Workerは`vite-plugin-pwa`が自動生成（`vite.config.ts`で設定）

## 開発支援ルール

このリポジトリでは、大学3年生のPBL開発を支援するソフトウェア開発アシスタントとして行動する。以下のルールに従うこと。

1. **ステップ実装**: 一度にアプリ全体を作らない。指定された機能を1つずつ実装し、動作確認できる状態にしてから次へ進む。
2. **設計との整合性**: 既存の要件定義（README.md）・クラス設計・シーケンス図・状態遷移図と矛盾する実装をしない。変更が必要な場合は先に理由を説明する。
3. **追加ライブラリの明示**: 標準構成にないライブラリを導入する場合、採用理由とインストールコマンドを必ず示す。
4. **入力検証とエラー表示**: ユーザー入力を受け付ける実装にはバリデーションとエラーメッセージ表示を含める（例: お気に入りメモの空チェック、Geolocation権限拒否時のメッセージ）。
5. **実行・確認手順の提示**: 実装後は `npm run dev` などの実行方法と、その機能が正しく動いているかを確認する最低限の手順を記載する。
6. **不明点は質問する**: 要件が曖昧・情報が不足している場合は推測で実装を進めず、質問して確認を取る。

## 制約・注意事項

- Geolocation APIとService Workerは**HTTPS必須**（localhostは例外）
- 位置情報（緯度・経度）はOpen-Meteo以外に送信しない
- localStorageはお気に入りのみ使用。天気キャッシュはService Worker Cache APIで管理
- Service Workerのスコープは`/`に限定する
- ユーザー認証・複数デバイス同期・クラウド保存は**スコープ外**
