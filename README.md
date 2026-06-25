# 天候と服装のシステム

> 天気・気温・湿度をもとに、その日に適した服装を提案するFlutterモバイルアプリの要件定義ドキュメント

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [技術スタック](#2-技術スタック)
3. [機能一覧](#3-機能一覧)
4. [機能要求・非機能要求](#4-機能要求非機能要求)
5. [ユースケース](#5-ユースケース)
6. [クラス設計](#6-クラス設計)
7. [シーケンス図](#7-シーケンス図)
8. [状態遷移図](#8-状態遷移図)
9. [使用プラットフォーム](#9-使用プラットフォーム)

---

## 1. プロジェクト概要

### アプリ名
天候と服装のシステム

### 目的
天気・気温・湿度をもとに、その日に適した服装をユーザーに提案するFlutterモバイルアプリを開発する。朝・昼・夜の時間帯別に提案を行い、ユーザーが気に入った服装をメモとして端末内に保存できる。

### 作らないもの（非目標）
- 服装のコーディネート画像表示・ブランド推薦
- 週間予報・降水確率の表示
- 手動での都市名検索・時間帯のカスタマイズ
- 複数デバイス間のデータ同期・クラウド保存
- ユーザー認証

---

## 2. 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Flutter（Dart） |
| 対応プラットフォーム | iOS / Android |
| 天気データAPI | [Open-Meteo](https://open-meteo.com/)（APIキー不要・完全無料） |
| ローカル保存 | SharedPreferences または SQLite |
| バックエンド | なし（端末ローカルのみ） |

### Open-Meteo APIエンドポイント例

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lng}
  &hourly=temperature_2m,relativehumidity_2m,weathercode
```

---

## 3. 機能一覧

### コア機能（優先度：高）

| 機能名 | 概要 |
|--------|------|
| 天気データ取得 | Open-Meteo APIから気温・湿度・天気状態を取得する |
| 服装レコメンド表示 | 気象データをルールベースで判定し服装を提案する |
| 時間帯別提案（朝・昼・夜） | 3時間予報から朝昼夜ごとに服装を提示する |

### サポート機能（優先度：中）

| 機能名 | 概要 |
|--------|------|
| お気に入り登録 | ユーザーが任意のテキストを服装メモとして保存する |
| お気に入り一覧・削除 | 保存済みメモを一覧表示し個別に削除できる |
| オフライン時エラー表示 | 通信不能時にユーザーへ明示的なエラーを表示する |
| ローカルデータ永続化 | SharedPreferences / SQLiteで端末保存する |

### 共通機能

| 機能名 | 優先度 | 概要 |
|--------|--------|------|
| 位置情報取得（GPS） | 高 | 現在地の緯度・経度を端末から取得する |
| ナビゲーション | 中 | 画面間の遷移（BottomNav等） |
| ローディング表示 | 低 | API通信中のスピナー・スケルトン |
| アプリアイコン・スプラッシュ | 低 | ストア申請・初回起動時の表示 |

---

## 4. 機能要求・非機能要求

### 機能要求

システムが「何をするか」を定義する。

| 機能名 | 内容 | 分類 |
|--------|------|------|
| 天気データ取得 | Open-Meteo APIから気温・湿度・天気状態を取得する | コア |
| 位置情報取得 | 端末GPSから現在地の緯度・経度を取得する | コア |
| 服装レコメンド表示 | 気象データをルールベースで判定し服装を提案する | コア |
| 時間帯別提案 | 朝・昼・夜それぞれに異なる服装提案を表示する | コア |
| お気に入り登録 | ユーザーが任意のテキストを服装メモとして保存する | サポート |
| お気に入り一覧・削除 | 保存済みメモを一覧表示し個別に削除できる | サポート |
| オフライン時エラー表示 | 通信不能時にユーザーへ明示的なエラーを表示する | サポート |

### 非機能要求

システムが「どのように動くか」を定義する。

#### 性能

| 要求 | 基準・根拠 |
|------|-----------|
| アプリ起動から天気表示まで3秒以内 | Open-Meteo応答速度 + GPS取得の合計を考慮 |
| お気に入りの読み込みは即時（500ms以内） | ローカル保存のためAPI待ちなし |

#### セキュリティ

| 要求 | 基準・根拠 |
|------|-----------|
| 位置情報は端末外へ送信しない | Open-Meteoへの送信は緯度経度のみ・匿名 |
| お気に入りデータは端末ローカルにのみ保存 | クラウド送信・外部共有なし |
| 位置情報取得は初回起動時に許可を明示的に求める | iOS/Android OSの権限モデルに準拠 |

#### ユーザビリティ

| 要求 | 基準・根拠 |
|------|-----------|
| 主要操作は3タップ以内で完結する | 起動→天気確認、起動→お気に入り登録の両導線 |
| エラー・ローディング状態を必ず画面上に示す | 通信中スピナー、オフライン時メッセージ表示 |
| iOS・Android両プラットフォームで同一UXを提供 | FlutterのクロスプラットフォームUIを活用 |

#### 保守性

| 要求 | 基準・根拠 |
|------|-----------|
| 服装提案ロジックを独立したファイルに分離する | ルール変更時にUI側を触らなくてよい構造 |
| APIのエンドポイントや閾値は定数として一元管理 | 変更箇所を1ファイルに集約し修正コストを下げる |
| FlutterのWidget単位でコンポーネントを分割する | 再利用性と可読性の確保。テスト容易性にも寄与 |

---

## 5. ユースケース

アクターは3つ定義している。「ユーザー」が主アクター、「端末GPS」と「Open-Meteo API」が外部システムとしての副アクターとなる。

```mermaid
flowchart LR
  User(["ユーザー"])
  GPS(["端末GPS"])
  API(["Open-Meteo API"])

  subgraph SYS ["天候と服装のシステム"]
    UC1["天気・気温・湿度を確認する"]
    UC2["服装レコメンドを見る"]
    UC3["時間帯別の服装提案を見る"]
    UC4["お気に入り服装を登録する"]
    UC5["お気に入り一覧を管理する"]
    UC6["位置情報を取得する"]
    UC7["天気データを取得する"]
    UC8["エラーを表示する"]
  end

  User -->|uses| UC1
  User -->|uses| UC2
  User -->|uses| UC3
  User -->|uses| UC4
  User -->|uses| UC5

  UC1 -->|«include»| UC6
  UC1 -->|«include»| UC7
  UC2 -->|«include»| UC1
  UC3 -->|«include»| UC1
  UC7 -.->|«extend» オフライン時| UC8

  UC6 --- GPS
  UC7 --- API
```

### 矢印の読み方

- **実線 `«include»`** — 必ず呼び出される関係（服装提案は必ず天気確認を内包）
- **点線 `«extend»`** — 条件付きで発生する関係（オフライン時のみエラー表示が起動）

---

## 6. クラス設計

```mermaid
classDiagram
  class Location {
    +double latitude
    +double longitude
    +String cityName
    +DateTime fetchedAt
    +getCurrentLocation() Location
    +isValid() bool
  }

  class WeatherData {
    +double temperature
    +int humidity
    +String condition
    +DateTime observedAt
    +List~HourlyForecast~ hourlyForecasts
    +isStale() bool
  }

  class HourlyForecast {
    +TimeOfDay time
    +double temperature
    +int humidity
    +String condition
  }

  class OutfitRecommendation {
    +String morningOutfit
    +String afternoonOutfit
    +String eveningOutfit
    +DateTime generatedAt
    +getSummary() String
  }

  class OutfitRule {
    +double tempMin
    +double tempMax
    +int humidityMax
    +String condition
    +String suggestion
    +matches(double temp, int humidity, String cond) bool
  }

  class RecommendationEngine {
    +List~OutfitRule~ rules
    +generate(WeatherData weather) OutfitRecommendation
    +selectRule(double temp, int humidity, String cond) OutfitRule
  }

  class FavoriteOutfit {
    +String id
    +String memo
    +DateTime savedAt
    +update(String memo) void
  }

  class FavoriteRepository {
    +save(FavoriteOutfit item) void
    +findAll() List~FavoriteOutfit~
    +delete(String id) void
    +findById(String id) FavoriteOutfit
  }

  class WeatherRepository {
    +fetchWeather(Location loc) WeatherData
    +getCached() WeatherData
    +clearCache() void
  }

  class WeatherService {
    +baseUrl: String
    +get(double lat, double lng) WeatherData
  }

  class LocalStorage {
    +write(String key, String value) void
    +read(String key) String
    +delete(String key) void
  }

  WeatherData        "1"   *-- "1..*" HourlyForecast      : contains
  RecommendationEngine "1" o-- "1..*" OutfitRule           : holds
  RecommendationEngine "1" --> "1"    WeatherData          : uses
  RecommendationEngine "1" --> "1"    OutfitRecommendation : creates
  WeatherRepository  "1"   --> "1"    WeatherService       : calls
  WeatherRepository  "1"   --> "1"    Location             : uses
  WeatherRepository  "1"   --> "1"    WeatherData          : returns
  FavoriteRepository "1"   --> "1..*" FavoriteOutfit       : manages
  FavoriteRepository "1"   --> "1"    LocalStorage         : uses
```

### 関連の種類

| 記法 | 種類 | 説明 |
|------|------|------|
| `*--` | コンポジション | WeatherDataが消えるとHourlyForecastも消える強い所有 |
| `o--` | 集約 | OutfitRuleはEngineとは独立して差し替え可能 |
| `-->` | 依存 | 「使う」関係。実装を差し替えても影響が少ない |

---

## 7. シーケンス図

### UC1：天気取得・服装提案

```mermaid
sequenceDiagram
  autonumber
  actor User as ユーザー
  participant UI as ホーム画面
  participant Ctrl as WeatherController
  participant Repo as WeatherRepository
  participant API as Open-Meteo API
  participant Eng as RecommendationEngine

  User->>UI: アプリ起動
  UI->>Ctrl: onInit()
  Ctrl->>Repo: getCurrentLocation()
  alt 位置情報の権限なし
    Repo-->>Ctrl: PermissionDeniedError
    Ctrl-->>UI: showPermissionDialog()
    UI-->>User: 位置情報の許可を求める
    User->>UI: 許可する
    UI->>Ctrl: retryWithPermission()
  end
  Repo-->>Ctrl: Location
  alt キャッシュが有効（5分以内）
    Ctrl->>Repo: getCached()
    Repo-->>Ctrl: WeatherData
  else キャッシュなし or 期限切れ
    Ctrl->>Repo: fetchWeather(Location)
    Repo->>API: GET /forecast?lat&lng&hourly
    alt ネットワークエラー
      API-->>Repo: NetworkError
      Repo-->>Ctrl: OfflineError
      Ctrl-->>UI: showOfflineError()
      UI-->>User: オフラインエラー表示
    else 取得成功
      API-->>Repo: JSON（3時間ごと予報）
      Repo-->>Ctrl: WeatherData
    end
  end
  Ctrl->>Eng: generate(WeatherData)
  loop 朝・昼・夜の各時間帯
    Eng->>Eng: selectRule(temp, humidity, condition)
  end
  Eng-->>Ctrl: OutfitRecommendation
  Ctrl-->>UI: render(WeatherData, OutfitRecommendation)
  UI-->>User: 天気＋時間帯別服装を表示
```

### UC4：お気に入り登録

```mermaid
sequenceDiagram
  autonumber
  actor User as ユーザー
  participant UI as お気に入り登録画面
  participant Ctrl as FavoriteController
  participant Repo as FavoriteRepository
  participant DB as LocalStorage

  User->>UI: 「お気に入りに追加」をタップ
  UI-->>User: テキスト入力ダイアログを表示
  User->>UI: 服装メモを入力して保存
  UI->>Ctrl: onSave(memo)
  alt メモが空
    Ctrl-->>UI: showValidationError()
    UI-->>User: 「メモを入力してください」
  else 入力あり
    Ctrl->>Repo: save(FavoriteOutfit)
    Repo->>DB: write(id, memo, savedAt)
    DB-->>Repo: 保存完了
    Repo-->>Ctrl: success
    Ctrl-->>UI: showSuccessMessage()
    UI-->>User: 「保存しました」トースト表示
  end
```

### UC5：お気に入り管理

```mermaid
sequenceDiagram
  autonumber
  actor User as ユーザー
  participant UI as お気に入り一覧画面
  participant Ctrl as FavoriteController
  participant Repo as FavoriteRepository
  participant DB as LocalStorage

  User->>UI: お気に入り画面を開く
  UI->>Ctrl: onInit()
  Ctrl->>Repo: findAll()
  Repo->>DB: read(favorites)
  DB-->>Repo: 保存済みデータ
  alt データなし
    Repo-->>Ctrl: 空リスト
    Ctrl-->>UI: showEmptyState()
    UI-->>User: 「まだ登録がありません」
  else データあり
    Repo-->>Ctrl: List~FavoriteOutfit~
    Ctrl-->>UI: render(list)
    UI-->>User: お気に入り一覧を表示
  end
  User->>UI: 削除ボタンをタップ
  UI->>Ctrl: onDelete(id)
  Ctrl->>Repo: delete(id)
  Repo->>DB: delete(id)
  DB-->>Repo: 削除完了
  Repo-->>Ctrl: success
  Ctrl->>Repo: findAll()
  Repo->>DB: read(favorites)
  DB-->>Repo: 更新済みデータ
  Repo-->>Ctrl: List~FavoriteOutfit~
  Ctrl-->>UI: render(updatedList)
  UI-->>User: 一覧を更新して表示
```

---

## 8. 状態遷移図

### アプリ全体

```mermaid
stateDiagram-v2
  [*] --> Launching : アプリ起動

  state Launching {
    [*] --> CheckingPermission : 初期化開始
    CheckingPermission --> PermissionGranted : 位置情報が許可済み
    CheckingPermission --> PermissionDenied : 権限なし
    PermissionDenied --> PermissionGranted : ユーザーが許可
    PermissionDenied --> [*] : ユーザーが拒否
    PermissionGranted --> [*] : 起動処理完了
  }

  Launching --> LoadingWeather : 権限取得完了
  Launching --> PermissionError : 権限を拒否

  state LoadingWeather {
    [*] --> FetchingLocation : GPS取得開始
    FetchingLocation --> FetchingAPI : 位置情報取得成功
    FetchingLocation --> LocationError : GPS取得失敗
    FetchingAPI --> WeatherLoaded : APIレスポンス受信
    FetchingAPI --> NetworkError : 通信エラー
    WeatherLoaded --> [*]
    LocationError --> [*]
    NetworkError --> [*]
  }

  LoadingWeather --> HomeReady : 天気・服装提案の表示完了
  LoadingWeather --> OfflineError : ネットワーク不通
  LoadingWeather --> LocationError : GPS取得失敗

  HomeReady --> LoadingWeather : 更新ボタンタップ / 5分経過
  HomeReady --> FavoriteFlow : お気に入りタブをタップ

  state FavoriteFlow {
    [*] --> FavoriteList : 一覧読み込み
    FavoriteList --> AddingFavorite : 追加ボタンタップ
    AddingFavorite --> Validating : 保存ボタンタップ
    Validating --> FavoriteList : 保存成功
    Validating --> AddingFavorite : バリデーションエラー
    FavoriteList --> DeletingFavorite : 削除ボタンタップ
    DeletingFavorite --> FavoriteList : 削除完了
    FavoriteList --> [*]
  }

  FavoriteFlow --> HomeReady : ホームタブをタップ
  OfflineError --> LoadingWeather : 再試行ボタンタップ
  PermissionError --> [*] : アプリ終了
  HomeReady --> [*] : アプリ終了
```

### 天気データ（WeatherData）

```mermaid
stateDiagram-v2
  [*] --> Absent : アプリ初回起動

  Absent --> Fetching : fetchWeather()呼び出し

  state Fetching {
    [*] --> ResolvingLocation : GPS取得中
    ResolvingLocation --> CallingAPI : 位置情報取得成功
    ResolvingLocation --> LocationFailed : GPS取得失敗
    CallingAPI --> Parsing : HTTPレスポンス200
    CallingAPI --> NetworkFailed : 通信エラー / タイムアウト
    Parsing --> [*] : パース完了
    LocationFailed --> [*]
    NetworkFailed --> [*]
  }

  Fetching --> Fresh : データ取得・保存成功
  Fetching --> Error : 取得失敗

  Fresh --> Fresh : キャッシュ参照（5分以内）
  Fresh --> Stale : 5分経過
  Fresh --> Fetching : 手動更新

  Stale --> Fetching : fetchWeather()呼び出し
  Stale --> Stale : キャッシュ参照（期限切れ表示付き）

  Error --> Fetching : 再試行
  Error --> Absent : キャッシュクリア

  note right of Fresh : isStale() = false / キャッシュ有効
  note right of Stale : isStale() = true / 再取得が必要
```

### お気に入り（FavoriteOutfit）

```mermaid
stateDiagram-v2
  [*] --> Idle : お気に入り画面を開く

  Idle --> Loading : findAll()呼び出し

  state Loading {
    [*] --> ReadingStorage : LocalStorage読み込み中
    ReadingStorage --> [*] : 読み込み完了
  }

  Loading --> Empty : データ件数 = 0
  Loading --> Listed : データ件数 ≥ 1

  Empty --> Adding : 追加ボタンタップ
  Listed --> Adding : 追加ボタンタップ
  Listed --> Deleting : 削除ボタンタップ

  state Adding {
    [*] --> InputOpen : ダイアログ表示
    InputOpen --> Validating : 保存ボタンタップ
    Validating --> Saving : 入力あり（バリデーション通過）
    Validating --> InputOpen : 入力なし（バリデーションエラー）
    Saving --> [*] : write()完了
    InputOpen --> [*] : キャンセル
  }

  state Deleting {
    [*] --> ConfirmingDelete : 削除確認ダイアログ表示
    ConfirmingDelete --> Removing : 削除を確定
    ConfirmingDelete --> [*] : キャンセル
    Removing --> [*] : delete()完了
  }

  Adding --> Loading : 保存完了 → 再読み込み
  Adding --> Listed : キャンセル
  Deleting --> Loading : 削除完了 → 再読み込み
  Deleting --> Listed : キャンセル

  Empty --> [*] : 画面を離れる
  Listed --> [*] : 画面を離れる
```

---

## 9. 使用プラットフォーム

本ドキュメントの要件定義作業はすべて以下のツールのみで完結した。

| ツール | 用途 |
|--------|------|
| [Claude（claude.ai）](https://claude.ai) | ヒアリング・要件整理・全図の生成 |
| [Mermaid.js](https://mermaid.js.org/) | ユースケース図・クラス図・シーケンス図・状態遷移図のレンダリング |

外部ツールへのアクセスやファイルエクスポートは一切行っておらず、すべてブラウザ内で完結している。

---

*このドキュメントはClaude（claude.ai）を使用して生成された要件定義ドキュメントです。*
