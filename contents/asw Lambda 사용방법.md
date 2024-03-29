---
date: '2023-02-16'
title: '일정시간이 되면 서버에서 자동으로 api를 호출하고 db에 저장하는 방법'
categories: ['WEB/APP']
summary: 'aws Lambda, s3, EventBridge, RDS, EC2, NAT Instance를 사용해보자.'
thumbnail: './test.png'
---

<br>

<br>

저는 쿠팡 api로 가격데이터를 매일 가져와서 가격의 흐름을 확인할 수 있는 웹 서비스를 기획하고 있습니다.

<br>

그전에 로컬에서 해당 코드를 매일 실행시키는 것은 번거로운 과정이니, aws Lambda와 Amazon EventBridge를 통해 매일 일정한 시간에 api를 호출하여 s3에 엑셀 저장 및 RDS를 활용한 db 저장 기능을 구현해보려고 합니다.

<div id="aws Lambda란?"></div>

## aws Lambda란?

Amazon Web Services(AWS)에서 제공하는 서버리스 컴퓨팅 서비스입니다. 이 서비스는 개발자가 서버 관리에 신경 쓰지 않고 코드 실행에 집중할 수 있게 해주는 플랫폼입니다.

<br>

코드를 업로드하고 실행 조건(트리거)을 설정하기만 하면 AWS가 나머지를 관리합니다.

<br>

사용한 컴퓨팅 자원에 대해서만 비용을 지불합니다. 요청 수와 실행 시간에 따라 요금이 책정되며, 코드가 실행되지 않을 때는 비용이 발생하지 않습니다.

<div id="사용 방법"></div>

## 사용 방법

aws Lambda 대시보드에서 함수를 생성하고 코드 입력창에 단순히 입력하고 Depoly하여 코드를 반영하고 Test를 하면 간단히 실행해볼 수 있습니다.

<br>

**라이브러리 추가**

<br>

코드를 추가하는 것은 어렵지 않으나, 라이브러리를 추가하는 경우 처음 접하는 사람에게는 어려울 수 있습니다.

```
#python 디렉토리 생성
mkdir python

# python 패키지 설치 (amazon linux 에서는 기본 pip 명령어가 python 2.X 이므로 pip3를 입력해야 함)
$ pip3 install -t ./python pytz
```

위와 같이 AWS Lambda의 기본 환경에 이미 포함되어 있는 라이브러리 외 필요한 라이브러리를 python 디렉토리에 설치합니다.

<br>

한가지 주의해야할 점은 AWS Lambda 환경은 Linux 기반입니다. 그래서 pandas 같이 window, mac, linux 버전이 다른 라이브러리는 linux 버전 라이브러리를 설치해야합니다.

<br>

방법은 https://pypi.org/project/pandas/#files 해당 링크에 들어가 자신의 버전에 맞는 파일을 다운로드 후 압축을 풀어 python 디렉토리에 넣어주면 됩니다.

<br>

또한 requests 라이브러리를 사용하는 과정에서 오류가 났는데 requests는

```
$ pip3 install -t ./python requests==2.29.0 urllib3==1.26.16
```

위와 같은 버전으로 설치해야 AWS Lambda의 환경에서 오류가 나지 않습니다.

<br>

이렇게 라이브러리 설치가 모두 끝났다면, python 디렉토리가 포함되도록 .zip으로 압축합니다.

<br>

압축한 파일은 Lambda > 계층 경로로 가 계층을 생성 후, 다시 함수 화면으로 가 Add a layer 해주면 됩니다.

<div id="S3 연결하기"></div>

## S3 연결하기

AWS Lambda 함수에서 S3에 읽고 쓰기 권한을 가져오는 방법입니다.

<br>

Amazon S3에 버킷 생성 후 권한 탭의 버킷 정책에

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:service-role/lambda-role"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

위와 같이 입력하면 됩니다.

<br>

`123456789012` 부분은 AWS 계정 ID이며, 

`lambda-role`은 함수 > 구성탭 > 권한의 역할 이름, 

`your-bucket-name`은 대상 S3 버킷의 이름입니다.

## Amazon RDS

Amazon RDS는 다양한 배포 옵션을 제공하여, 다양한 운영 요구 사항과 성능, 가용성, 비용에 따라 최적의 데이터베이스 솔루션을 선택할 수 있는 서비스입니다.

<br>

기본적인 사용 방법과 초기 개발을 위한 무료 사용 방법이 있습니다.

<br>

우선 기본적인 사용 방법은

<br>

**사용 방법**

1. RDS > 데이터베이스 생성
2. 생성 옵션 설정
   - 배포 옵션: 단일 DB 인스턴스 (비용 효율을 위해 선택, 다만 백업 및 재해 복구를 하지 못함)
   - DB 인스턴스 클래스
     1. 스탠다드 클래스 (M 클래스 포함)
       - 특징: 스탠다드 클래스는 균형 잡힌 CPU와 메모리를 제공합니다. 일반적인 용도의 애플리케이션에 적합하며, 다양한 종류의 데이터베이스 워크로드에 폭넓게 사용됩니다.
       - 사용 사례: 웹 애플리케이션, 소규모/중간 규모의 데이터베이스, 개발 및 테스트 환경 등에 적합합니다.
     2. 메모리 최적화 클래스 (R 및 X 클래스 포함)
        - 특징: 메모리 최적화 클래스는 높은 메모리 용량과 더불어 빠른 CPU 성능을 제공합니다. 메모리 집약적인 애플리케이션에 적합하며, 대규모 데이터베이스 작업과 복잡한 쿼리 처리에 유리합니다.
        - 사용 사례: 대규모 트랜잭션 처리, 대규모 데이터베이스, 복잡한 쿼리가 많은 애플리케이션, 데이터 웨어하우징 등에 적합합니다.
     3. 버스터블 클래스 (T 클래스 포함)
        - 특징: 버스터블 클래스는 평상시에는 제한된 CPU 성능을 제공하지만, 필요에 따라 CPU 성능을 일시적으로 늘릴 수 있는 "버스팅" 기능을 제공합니다. 가변적인 컴퓨팅 리소스가 필요한 경우에 적합합니다.
        - 사용 사례: 경량 또는 간헐적인 트래픽을 처리하는 애플리케이션, 개발 및 테스트 환경, 소규모 애플리케이션 등에 적합합니다.
   - EC2 컴퓨팅 리소스에 연결해야하는 경우
     - 직접 서버 관리 필요
   - 퍼블릭 액세스
     - 안과 데이터의 민감성을 고려할 때, 가능한 한 VPC 내부에서 Lambda 함수와 데이터베이스 간의 통신을 구성하는 것이 바람직합니다. 퍼블릭 액세스는 편리할 수 있지만, 보안 리스크를 증가시킬 수 있으므로 주의가 필요합니다. 실제 프로덕션 환경에서는 퍼블릭 액세스보다는 VPC 내부에서의 접근 방식을 선택하는 것이 일반적으로 더 안전합니다.
   - RDS Proxy
     - 연결 풀링을 통해 데이터베이스 서버에 대한 부하를 줄이고, 연결 설정 및 종료로 인한 오버헤드를 감소시킵니다.
     - 데이터베이스 서버로의 트래픽을 조절하여 부하 분산을 제공합니다.
     - 데이터베이스 연결 중에 발생할 수 있는 장애를 자동으로 감지하고 복구합니다.
     - 그러나 추가 비용이 발생하기 때문에, Proxy 도입 전에 애플리케이션의 요구 사항과 비용 대비 이득을 충분히 고려해야 합니다.

**무료로 사용하기**

<br>

무료로 사용하는 방법은 프리 티어로 선택하는 방법이다.

<br>

우선 프리 티어 설정이 가능한 엔진 옵션 선택하여 프리 티어 선택을 한다.

<br>

이렇게만 하면 무료로 사용된다고 생각할 수 있지만, 추가로 아래의 설정을 해줘야 완전한 무료이다.

<br>

1. DB 인스턴스 클래스: dn.t2.micro
2. 스토리지 자동 조정 활성화 off
3. 백업 보존 기간: 0days
4. 스토리지 사용량 20GiB 넘기지 않기

이렇게 데이터베이스 생성을 마쳤으면, 한국에 맞추어 파라미터 그룹 생성 및 설정을 해주어야한다.

<br>

**파라미터 그룹**

1. RDS > 파라미터 그룹 > 파라미터 그룹 생성
2. 작업 > 편집
3. 값 변경 
   - timezone: Asia/Seoul 
   - character set: utf4mb4
   - collation: utf8mb4_general_ci
4. RDS > 데이터베이스 > 수정
5. DB 파라미터 그룹을 생성한 파리미터 그룹으로 설정
6. 즉시 적용 선택 후 수정 완료되면 재부팅

이제 모든 설정을 맞췄으니 AWS RDS를 DBeaver에 연결해보자

<br>

**DBeaver에 연결**

- DBeaver란?

다양한 데이터베이스 관리 시스템(DBMS)에 대해 통합 데이터베이스 관리 및 개발 도구를 제공하는 오픈 소스 소프트웨어입니다.

<br>

https://dbeaver.io/download/ 해당 링크를 통해 설치할 수 있습니다.

- DBeaver에 연결하기

1. 우선 RDS 데이터베이스의 퍼블릭 엑세스를 예라고 설정한다. 
   - 실제 서비스를 할 때는 아니오로 설정해야한다.
   - 다만 아니오일 때 해당 데이터베이스의 접근하려면 복잡함으로 우선 개발을 마치기 전까지는 예로 설정한다.
2. VPC 보안 그룹 클릭 > 인바운드 규칙 편집 > 규칙 추가 > 내 IP
   - 기본으로 냅두면 연결이 되지 않으니 수정해야한다.
3. DBeaver를 열고 좌측 상단에 콘센트 모양에 +가 붙어있는 아이콘을 선택한다.

<img style="width: 30%; margin-bottom: 40px;" id="output" src="https://velog.velcdn.com/cloudflare/shawnhansh/ff70b719-786a-4145-b33e-22d5ddad7657/4.png">
<img style="width: 80%; margin-bottom: 40px;" id="output" src="https://velog.velcdn.com/cloudflare/shawnhansh/b249e387-f40e-4d8c-9493-374788d5e7ad/image.png">
<img style="width: 80%; margin-bottom: 40px;" id="output" src="https://velog.velcdn.com/cloudflare/shawnhansh/281dca40-f36d-4238-9811-edc2b81244a4/7.png">

- Server Host : 엔드포인트
- Port : 포트
- Database : DB 이름 (초기 데이터베이스 이름 설정 하지 않았으면 비워둠)
- Username : 마스터 사용자 이름
- Password : 비밀번호

<br>

**Lambda에 연결**

<img style="width: 70%; margin-top: 40px;" id="output" src="aws/architecture.PNG">

<br>

이 부분에서 문제가 많았습니다.

1. lambda가 RDS에 연결하기 위해서는 같은 VPC에 위치하여야 합니다.
2. 그런데 vpc에 lambda가 위치하면 외부 api를 호출할 수 없습니다.
3. 그래서 NAT instance를 만들어 이를 통해 외부 api를 호출하여야 합니다.

<br>

여러 시행착오 끝에 그림과 같은 구조로 해결하였습니다.

<br>

- lambda에서 설정
  1. IAM > 역할 > lambda 함수에 해당하는 역할명
  2. 권한 추가: AWSLambdaVPCAccessExecutionRole (lambda에서 VPC를 사용가능하게 함)
  3. Lambda 함수 > 구성 > VPC 편집
  4. NAT instance와 연결된 서브넷 선택
  5. RDS와 동일한 보안 그룹 선택

<div id="NAT Instance"></div>

## NAT Instance

AWS에서 네트워크를 설계할때 NAT의 사용은 필수적입니다. VPC 내에서는 외부 인터넷 접속이 불가하기 때문입니다.

<br>

AWS에서 강력하게 밀어주는 최신식 NAT Gateway 서비스를 이용해서 손쉽게 사설망 외부 통신을 할 수 있지만, 비용 문제가 발생하므로 본 프로젝트에서는 NAT Instance를 사용합니다.

<br>

NAT 인스턴스는 EC2 인스턴스를 NAT용으로 설정해 사용하는, 이른바 불안정하고 한물 간 구식 기술이지만 저렴하며 프리티어를 사용하면 무료로 사용할 수 있습니다.

<br>

**사용 방법**

- EC2 설정

1. EC2 > 인스턴스 > 인스턴스 시작
2. 생성 옵션 설정
   - Application and OS Images (Amazon Machine Image) 
     - EC2 인스턴스를 시작하는 데 사용되며, 운영 체제(OS), 애플리케이션 서버 및 애플리케이션과 같은 소프트웨어가 미리 구성되어 있습니다.
     - NAT Instance로 사용할 것이므로 NAT를 검색하여 프리 티어 사용 가능한 AMI를 선택합니다.
   - 프리티어 사용 가능
     - 일정한 제한된 사용량에 대해서 무료로 제공
   - 키 페어(Key Pair)
     - 보안상의 목적으로 사용되는 한 쌍의 암호화 키
   - 스토리지 구성 
     - SSD 기반은 빠르지만 고비용이고 HDD는 저렴하지만 SSD에 비해 읽기/쓰기 속도가 느림
     - 본인은 저렴한 HDD 기반의 standard(Magnetic) 선택
   - 고급 세부 정보 
     - 많은 경우, 기본 설정만으로도 EC2 인스턴스를 충분히 구동하고 관리할 수 있습니다. 특별한 설정이나 구성이 필요하지 않다면 고급 세부 정보를 변경하지 않아도 됩니다.
     - 고급 세부 정보는 보다 세부적인 설정이 필요한 숙련된 사용자나 특정 요구 사항이 있는 경우에 유용합니다. 예를 들어, 특정 소프트웨어를 자동으로 설치하려면 사용자 데이터를 설정할 수 있습니다.
3. 인스턴스 생성 후 선택 > 작업 > 네트워킹 > 소스/대상 확인변경 중지
   - 일반적으로, AWS에서 실행되는 각 EC2 인스턴스는 '소스/대상 검사(Source/Destination Check)' 기능이 활성화되어 있습니다.
   - 이 기능은 인스턴스가 받거나 보내는 트래픽이 해당 인스턴스를 목적지나 출발지로 하는지를 확인합니다. 즉, 인스턴스는 자신이 최종 목적지나 출발점인 트래픽만 처리합니다.
   - 하지만, NAT 인스턴스의 경우 이 동작이 적합하지 않습니다. NAT 인스턴스는 다른 인스턴스의 트래픽을 인터넷으로 중계하는 역할을 하기 때문에, 자신이 트래픽의 최종 목적지나 출발점이 아닌 경우에도 트래픽을 수신하고 전송할 수 있어야 합니다.
4. 탄력적 IP > 탄력적 IP 주소 할당 > 나머지 냅두고 태그: 키 Name, 값 NAT-coopangpl
5. 탄력적 주소 선택 후 작업 > 탄력적 IP 주소 연결 > NAT Instance 연결
   - 탄력적 IP는 AWS 클라우드 환경에서 고정된 공용 IP 주소를 제공합니다. 이를 통해 인터넷에서 일관된 주소를 사용하여 인스턴스에 접근할 수 있습니다.
6. VPC > 라우팅 테이블 > 라우팅 테이블 생성 > 대상: 0.0.0.0/0, 인스턴스 아까 만든 NAT Instance
7. 서브넷이 총 4개가 있는데 2개는 internet gateway 라우팅 테이블에 연결, 2개는 NAT Instance에 연결된 서브넷에 연결합니다.
8. 그 후 lambda 함수를 NAT Instance에 연결된 서브넷으로 지정하면 외부 api 호출이 가능합니다.

<div id="Amazon EventBridge"></div>

## Amazon EventBridge

Amazon EventBridge는 AWS에서 제공하는 서버리스 이벤트 버스 서비스로, 다양한 소스에서 발생하는 이벤트를 감지하거나 원하는 실행 일정을 정하면, 그에 따라 AWS 서비스, 사용자가 정의한 로직, 또는 서드파티 애플리케이션에 자동으로 반응할 수 있도록 돕습니다.

<br>

이제 모든 준비를 마쳤으니, Amazon EventBridge를 통해 원하는 시간마다 aws Lambda 함수가 실행되게 설정해봅시다. 

<br>

**사용 방법**

<br>

Amazon EventBridge > 일정 > 일정 생성으로 가서 일정 세부 정보 지정을 입력합니다.

<br>

본 프로젝트에서는 매일 오전 10시 15분에 실행되게 하므로 Cron 표현식을 "15 10 * * ? *"로 입력합니다.

<br>

다음으로는 대상 선택을 합니다. aws lambda 함수를 실행시킬 것 이므로 모든 api > aws lambda > invoke > 실행할 함수 선택한 뒤 나머지 입력한 후 일정을 생성합니다.

<div id="과금 피하기"></div>

## 과금 피하기

<img style="width: 100%; margin-bottom: 40px;" id="output" src="aws/money.PNG">

한달을 이용해본 결과 과금이 되었습니다!!ㅠㅠ

<br>

과금이 된 이유는 RDS 프리티어로 사용해도 실행 가능한 시간을 넘으면 과금된 것이었습니다.

<br>

제가 RDS를 이용하는 것은 단순히 하루에 한번 DB에 저장하기 위해서인데 쓸데없이 하루 종일 실행시켜둔 것이었습니다. 아까운 내 3만원ㅠㅠ

<br>

그래서 이를 해결하기 위해 AWS Lambda를 통해 사용하지 않을 때는 Instance 및 RDS 자동 중지 및 시작하려고 합니다.

<br>

실행 코드

```
import boto3

region = 'ap-northeast-2'
instances = []
ec2_r = boto3.resource('ec2')
ec2 = boto3.client('ec2', region_name=region)
rds = boto3.client('rds')

for instance in ec2_r.instances.all():
    if instance.state['Name'] == 'stopped':
        for tag in instance.tags:
            if tag['Key'] == 'auto-start':
                if tag['Value'] == 'true':
                    instances.append(instance.id)

def lambda_handler(event, context):
    if len(instances) == 0:
        print('instance not found')
    else:
        ec2.start_instances(InstanceIds=instances)
        print('start your instances: ' + str(instances))
        
    dbs = rds.describe_db_instances()
    for db in dbs['DBInstances']:
        if (db['DBInstanceStatus'] == 'stopped'):
            doNotStart=1
            try:
                GetTags=rds.list_tags_for_resource(ResourceName=db['DBInstanceArn'])['TagList']
                for tags in GetTags:
                    if(tags['Key'] == 'auto-start' and tags['Value'] == 'true'):
                        result = rds.start_db_instance(DBInstanceIdentifier=db['DBInstanceIdentifier'])
                        print ("Starting instance: {0}.".format(db['DBInstanceIdentifier']))
                if(doNotStart == 1):
                    doNotStart=1
            except Exception as e:
                print ("Cannot start instance {0}.".format(db['DBInstanceIdentifier']))
                print(e)
```

중지 코드

```
import boto3

region = 'ap-northeast-2'
instances = []
ec2_r = boto3.resource('ec2')
ec2 = boto3.client('ec2', region_name=region)
rds = boto3.client('rds')

for instance in ec2_r.instances.all():
    if instance.state['Name'] == 'running':
        for tag in instance.tags:
            if tag['Key'] == 'auto-stop':
                if tag['Value'] == 'true':
                    instances.append(instance.id)

def lambda_handler(event, context):
    if len(instances) == 0:
        print('instance not found')
    else:
        ec2.stop_instances(InstanceIds=instances)
        print('stopped your instances: ' + str(instances))
        
    dbs = rds.describe_db_instances()
    for db in dbs['DBInstances']:
        if (db['DBInstanceStatus'] == 'available'):
            DoNotStop=1
            try:
                GetTags=rds.list_tags_for_resource(ResourceName=db['DBInstanceArn'])['TagList']
                for tags in GetTags:
                    if(tags['Key'] == 'auto-stop' and tags['Value'] == 'true'):
                        result = rds.stop_db_instance(DBInstanceIdentifier=db['DBInstanceIdentifier'])
                        print ("Stopping instance: {0}.".format(db['DBInstanceIdentifier']))
                if(DoNotStop == 1):
                    DoNotStop=1
            except Exception as e:
                print ("Cannot stop instance {0}.".format(db['DBInstanceIdentifier']))
                print(e)
```

하지만 코드를 실행시키기 위해서는 EC2 Instance와 RDS를 변경할 권한이 있어야 합니다.

<br>

구성 > 권한 > 역할 이름을 클릭 > 정책 이름 클릭 > JSON > 편집

<br>

실행 권한

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "start",
            "Effect": "Allow",
            "Action": [
                "ec2:StartInstances",
                "rds:StartDBCluster",
                "rds:StartDBInstance"
            ],
            "Resource": [
                "arn:aws:rds:*:*:db:*",
                "arn:aws:ec2:*:*:instance/*"
            ]
        },
        {
            "Sid": "describe",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeTags",
                "ec2:DescribeInstanceStatus",
                "rds:ListTagsForResource",
                "rds:DescribeDBInstances",
                "rds:DescribeDBClusters"
            ],
            "Resource": "*"
        }
    ]
}
```

중지 권한

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "stop",
            "Effect": "Allow",
            "Action": [
                "ec2:StopInstances",
                "ec2:DescribeInstances",
                "ec2:DescribeTags",
                "ec2:DescribeInstanceStatus",
                "rds:StopDBCluster",
                "rds:ListTagsForResource",
                "rds:DescribeDBInstances",
                "rds:StopDBInstance",
                "rds:DescribeDBClusters"
            ],
            "Resource": "*"
        }
    ]
}
```

이제 해당 EC2 Instance와 RDS의 태그에서 key: auto-start, auto-stop을 true로 추가한다.

<br>

이제 마지막으로 Lambda의 트리거 추가에서 EventBridge를 선택하여 원하는 시간이 함수가 실행되도록 한다.

<br>

여기서 주의할 점은 Lambda의 트리거 추가에서 시간은 UTC 기준이므로 현지 시간 기준을 잘 살펴야한다!!

<br>

[참고](https://sonit.tistory.com/19)