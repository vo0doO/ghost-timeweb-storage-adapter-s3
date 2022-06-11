# Адаптер хранилища Ghost TimeWeb

Адаптер хранилища TimeWeb S3 для Ghost 5.x

Для получения поддержки Ghost 0.10.x и 0.11.x см.
[Ghost storage adapter s3 v1.3.0](https://github.com/vo0doo/ghost-timeweb-storage-adapter-s3/releases/tag/v1.3.0).

## Монтаж

```shell
npm install ghost-timeweb-storage-adapter-s3
mkdir -p ./content/adapters/storage
cp -r ./node_modules/ghost-storage-adapter-s3 ./content/adapters/storage/s3
```

## Конфигурация

```json
"storage": {
  "active": "s3",
  "s3": {
    "accessKeyId": "YOUR_ACCESS_KEY_ID",
    "secretAccessKey": "YOUR_SECRET_ACCESS_KEY",
    "region": "YOUR_REGION_SLUG",
    "bucket": "YOUR_BUCKET_NAME",
    "assetHost": "YOUR_OPTIONAL_CDN_URL (See note 1 below)",
    "signatureVersion": "REGION_SIGNATURE_VERSION (See note 5 below)",
    "pathPrefix": "YOUR_OPTIONAL_BUCKET_SUBDIRECTORY",
    "endpoint": "YOUR_OPTIONAL_ENDPOINT_URL (only needed for 3rd party S3 providers)",
    "serverSideEncryption": "YOUR_OPTIONAL_SSE (See note 2 below)",
    "forcePathStyle": true,
    "acl": "YOUR_OPTIONAL_ACL (See note 4 below)",
  }
}
```
Note 1: Обязательно включите «//» или соответствующий протокол в строку или переменную assetsHost, чтобы убедиться, что домен вашего сайта не добавлен перед CDN URL.

Note 2: если ваша корзина s3 применяет SSE, используйте serverSideEncryption с параметром [appropriate supported](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property) ценность.

Note 3: если вашим провайдерам s3 требуется стиль пути, вы можете включить его с помощью `forcePathStyle`

Note 4: если вы используете CloudFront, ACL объекта не нужно устанавливать на "public-read"

Note 5: [Support for AWS4-HMAC-SHA256](https://github.com/vo0doo/ghost-timeweb-storage-adapter-s3/issues/43)

### Через переменные среды

```
AWS_ACCESS_KEY_ID
AWS_DEFAULT_REGION
AWS_SECRET_ACCESS_KEY
GHOST_STORAGE_ADAPTER_S3_ENDPOINT
GHOST_STORAGE_ADAPTER_S3_PATH_BUCKET
GHOST_STORAGE_ADAPTER_S3_FORCE_PATH_STYLE

<!-- GHOST_STORAGE_ADAPTER_S3_ASSET_HOST  // optional -->
<!-- GHOST_STORAGE_ADAPTER_S3_PATH_PREFIX // optional -->
<!-- GHOST_STORAGE_ADAPTER_S3_SSE // optional -->
<!-- GHOST_STORAGE_ADAPTER_S3_ACL // optional -->
```

## Конфигурация АМС
Скорее всего, вы захотите настроить отдельную корзину S3 для своего блога, определенную роль IAM и, при необходимости, CloudFront для обслуживания из CDN.

### S3
Создайте новое ведро. Если вы используете CDN, регион не важен. После создания корзины выберите Статический хостинг веб-сайтов в свойствах и настройте ее для размещения веб-сайта.

В разрешениях выберите Bucket Policy и используйте генератор политик со следующими настройками:
- Select Type of Policy: **S3 Bucket Policy**
- Effect: **Allow**
- Principal: *
- AWS Service: **Amazon S3**
- Actions: **GetBucket**
- Amazon Resource Name (ARN): *your bucket's ARN, which you can get on its Bucket Policy page*

Generate the policy, copy it, then paste it in the Bucket policy editor and save.

### Я
Вы захотите создать пользовательскую роль в IAM, которая просто предоставит вашей установке Ghost необходимые разрешения для управления объектами в корзине S3.

Перейдите в IAM в консоли AWS и добавьте нового пользователя. Дайте ему имя пользователя, относящееся к вашему блогу, и выберите **Программный доступ** в качестве типа доступа.

Затем на странице разрешений выберите **Прикрепить существующие политики напрямую** и нажмите **Создать политику**. Для политики щелкните редактор JSON и добавьте следующую политику. Вы можете заменить **призрачное ведро** названием корзины S3 вашего блога.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::ghost-bucket"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:PutObjectVersionAcl",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::ghost-bucket/*"
        }
    ]
}
```

Эта политика позволяет пользователю просматривать содержимое корзины (первый оператор), а затем управлять объектами, хранящимися в корзине (вторая инструкция).

Наконец, создайте пользователя и скопируйте **Ключ доступа** и **Секретный ключ доступа**, которые вы будете использовать в своей конфигурации.

На этом вы можете закончить, но при желании вы можете разместить CDN Amazon CloudFront перед корзиной, чтобы ускорить процесс.

### Облачный фронт
CloudFront — это CDN, которая копирует объекты на серверах по всему миру, чтобы посетители вашего блога быстрее получали ваши ресурсы, используя ближайший к ним сервер. Он использует вашу корзину S3 в качестве «источника правды», которым он наполняет свои серверы.

Перейдите в CloudFront в AWS и выберите **Создать дистрибутив**. На следующем экране вы захотите оставить все как есть, за исключением следующих изменений:
- Исходное доменное имя: **Укажите URL-адрес конечной точки, указанный на панели хостинга статического веб-сайта в конфигурации корзины S3**.
- Политика протокола просмотра: **Перенаправление с HTTP на HTTPS**
- Автоматическое сжатие объектов: **Да**

Затем создайте дистрибутив.

Далее вам нужно настроить доменное имя так, чтобы оно указывало на поддомен в CloudFront, чтобы вы могли обслуживать статический контент через CDN. Нажмите на только что созданный дистрибутив и перейдите на вкладку «Общие». В разделе «Альтернативные доменные имена» добавьте поддомен из своего URL-адреса в качестве CDN. Например, если ваш домен *yourdomain.com*, сделайте что-то вроде *cdn.yourdomain.com*.

Далее вам нужно включить SSL. Если вы уже используете DNS-сервис Amazon Route53, возможно, у вас уже есть SSL-сертификат для вашего домена с подстановочным знаком, если нет, выберите его для своего субдомена. Если вы используете Route53, они могут автоматически добавлять правильные записи в ваши записи DNS для проверки и создания сертификата. Если нет, пройдите альтернативный маршрут.

Затем настройте запись DNS для поддомена для CloudFront. Перейдите к конфигурации DNS и добавьте запись A для **cdn** (или любого другого субдомена, который вы выбрали), а затем настройте его как псевдоним, указывающий на ваш URL-адрес распространения CloudFront. Если вы используете Route53, он фактически предоставит вам дистрибутив в качестве опции.

Наконец, в вашей конфигурации используйте субдомен для раздачи CloudFront в качестве параметра для *assetHost*.

## License

[ISC](./LICENSE.md)
