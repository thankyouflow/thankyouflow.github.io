---
date: '2024-01-04'
title: 'ChatLaw: Open-Source Legal Large Language Model with Integrated External Knowledge Bases 논문 리뷰'
categories: ['LLM', 'Legal']
summary: 'ChatLaw라는 중국 법률 LLM 오픈 소스 완벽 이해하기.'
thumbnail: './test.png'
---

<div id="Abstract"></div>

## Abstract

"ChatLaw"라는 새로운 개방형 법률 대규모 언어 모델에 대한 논문입니다.

<br>

고품질 데이터의 중요성을 강조하며, 법률 분야에 특화된 데이터셋을 신중하게 설계했습니다.

<br>

법률 데이터 스크리닝 중 참조 데이터 검색에서 발생할 수 있는 model hallucinations 문제를 해결하기 위해, 벡터 데이터베이스 검색과 키워드 검색을 결합한 방법을 도입했습니다.

<br>

이는 벡터 데이터베이스 검색만에 의존할 때 발생할 수 있는 부정확성을 줄이는 데 효과적입니다.

<br>

이 모델과 일부 데이터는 https://github.com/PKU-YuanGroup/ChatLaw 에서 오픈 소스로 공개되었습니다.

<div id="Introduction"></div>

## Introduction

법률 분야는 정확성이 요구되며, 법률 언어의 복잡성, 미묘한 해석, 법률의 지속적인 변화로 인해 맞춤형 솔루션이 필요합니다. 

<br>

하지만, 가장 발전된 모델인 GPT-4조차 법률 문제에 있어서는 hallucinations과 비논리적인 결과를 종종 보여줍니다.

<br>

중국 법률 분야를 위한 LLM의 필요성을 인식했지만, 당시에는 130억 파라미터를 초과하는 중국어 모델이 상용화되지 않았습니다.

<br>

따라서 OpenLLAMA라는 상용 가능한 모델을 기반으로 중국어 어휘를 확장하고 MOSS와 같은 소스에서 훈련 데이터를 포함시켜 기초 중국어 언어 모델을 만들었습니다.

<br>

이 기초 모델을 바탕으로 법률 특화 데이터를 통합하여 법률 모델인 ChatLaw를 훈련시켰습니다. 이 모델은 법률 언어 처리의 독특한 도전과 요구 사항에 맞게 설계되었습니다.

<br>

**hallucinations 완화를 위한 효과적인 접근법**

<br>

모델의 훈련 과정을 강화하고, 추론 단계에서 "상담(consult)", "참조(reference)", "자체 제안(self-suggestion)", "응답(response)"이라는 네 가지 모듈을 통합하는 방법을 제안합니다.

<br>

참조 모듈을 통해 vertical models과 정확한 법률 데이터베이스를 통합함으로써, 도메인 특화 지식을 모델에 주입하고 법률 데이터베이스의 정확한 정보를 활용하여 hallucinations의 발생을 줄입니다.

*수직 모델(Vertical Models): 특정 도메인이나 산업 분야에 특화된 인공지능 모델을 가리킵니다.

<br>

**LLM을 기반으로 한 법률 특징 단어 추출 모델**

<br>

사용자의 일상 언어에서 법률 특징 단어를 추출하는 모델을 훈련합니다.

<br>

이 모델은 법적 중요성을 가진 단어를 식별하여 사용자 입력 내의 법률 맥락을 효과적으로 식별하고 분석합니다.

<br>

**BERT 기반 법률 텍스트 유사성 계산 모델**

<br>

사용자의 일상 언어와 93만 건의 관련 법률 사례 텍스트로 구성된 데이터셋 간의 유사성을 측정하는 모델을 훈련합니다.

<br>

이를 통해 유사한 법률 텍스트를 효율적으로 검색할 수 있는 벡터 데이터베이스를 생성하여 추가 분석 및 참조를 용이하게 합니다.

<br>

**중국 법률 시험 테스트**

<br>

테스트 결과 하나의 범용 법률 LLM이 이 분야의 모든 작업에서 최적으로 수행하지 않을 수 있다는 점을 관찰했습니다.

<br>

따라서, 객관식 질문, 키워드 추출, 질문-답변 등 다양한 시나리오에 대해 다른 모델들을 훈련했습니다.

<br>

이러한 모델들의 선택과 배포를 관리하기 위해 HuggingGPT에서 제공하는 방법론을 사용하는 큰 LLM을 컨트롤러로 사용했습니다. 

<br>

이 컨트롤러 모델은 사용자의 요청에 따라 특정 모델을 동적으로 결정하여 주어진 작업에 가장 적합한 모델을 사용하도록 합니다.

<div id="Dataset"></div>

## Dataset

**다양한 법률 데이터 수집**

<br>

데이터셋은 법률 뉴스, 소셜 미디어 콘텐츠, 법률 업계 포럼의 토론 등을 포함한 다양한 원본 법률 데이터를 수집하여 구성됩니다.

<br>

이러한 소스들은 다양한 법률 주제와 토론에 대한 통찰력을 제공하며, 실제 법률 텍스트의 광범위한 범위를 제공합니다.

<br>


**질문:** 한 대학생의 일기에 "반드시 乙을 제거해야 한다. 사용할 수 있는 방법이 많다. 가장 좋은 방법은 독살이다"라는 말이 가득 쓰여 있었으나, 실제로 행동에 옮긴 적은 없습니다. 어느 날 지도 교사가 그 일기를 보고 경찰에 신고했습니다. 이러한 행위가 고의적 살인죄에 해당하나요?

<br>

**답변:** 제공된 상황에 따르면, 한 대학생이 일기에 "반드시 乙을 제거해야 한다. 사용할 수 있는 방법이 많다. 가장 좋은 방법은 독살이다"라고 썼지만, 실제로는 어떤 행동도 취하지 않았습니다. 어느 날 지도 교사가 그 학생의 일기를 보고 매우 걱정되어 경찰에 신고했습니다. 우리나라《형법》에 따르면, 이러한 행위는 범의를 표시한 것으로 간주되며, 무죄입니다.

<br>

**법률 규정 및 사법 해석 기반 구축**

<br>

법률 지식의 포괄적인 커버리지를 보장하기 위해, 데이터셋은 관련 법률 규정과 사법 해석을 포함합니다.

<br>

이는 데이터셋이 법적 틀을 반영하고 정확하고 최신의 정보를 제공하도록 합니다.

<br>

**질문:** 만약 어떤 근로자가 매일 10시간씩 일한다면, 그의 주당 근무 시간이 규정을 초과하나요?

<br>

**답변:** 《노동법》제36조에 따르면, 매일 근무 시간은 8시간을 초과해서는 안 됩니다. 따라서, 주당 근무 시간은 44시간을 초과할 것이며, 이는 규정을 초과한 것입니다.

<br>

**질문:** 만약 한 외국인이 우리나라 전시에 해외 무장세력에게 무기 장비를 제공한다면, 이는 적에게 자금을 제공하는 죄에 해당하나요?

<br>

**답변:** 적에게 자금을 제공하는 죄에 해당하지 않습니다.《형법》제112조에 따르면, 적에게 자금을 제공하는 죄의 주체는 오직 우리나라 시민만이 될 수 있으며, 외국인이나 국적 없는 사람은 적에게 자금을 제공하는 죄의 주체가 될 수 없습니다. 따라서, 외국인이 우리나라 전시에 해외 무장세력에게 무기 장비를 제공한다 하더라도 적에게 자금을 제공하는 죄에 해당하지 않습니다.

<br>

**실제 법률 상담 데이터 크롤링**

<br>

실제 법률 상담 데이터를 검색하여 기존 법률 상담 데이터셋을 활용합니다.

<br>

이를 통해 사용자가 일반적으로 마주치는 실제 법률 시나리오와 질문을 포함시켜, 데이터셋을 실용적인 법률 예시로 풍부하게 만듭니다.

<br>

**질문:** 만약 당사자가 변호사 비용을 지불할 능력이 없다면, 어떤 상황에서 변호사는 수수료를 감면하거나 면제해야 하나요? 예를 들어, 검찰청의 잘못된 체포로 인한 배상을 요청하는 경우, 업무 중 발생한 장애로 인해 회사에 의료비와 생활비 지급을 요구하는 경우, 교통사고 범죄로 변호사를 고용하여 변론을 요청하는 경우 등이 있습니다.

<br>

**답변:** 네, 만약 당사자가 변호사 비용을 지불할 능력이 없다면, 변호사는 수수료를 감면하거나 면제해야 할 상황은 다음과 같습니다: 검찰청의 잘못된 체포로 인한 배상을 요청하는 경우, 업무 중 발생한 장애로 인해 회사에 의료비와 생활비 지급을 요구하는 경우, 교통사고 범죄로 변호사를 고용하여 변론을 요청하는 경우 등입니다. 이러한 경우들은 모두 특별한 상황으로, 변호사는 당사자가 관련 문제를 해결하고 정의를 실현할 수 있도록 적시에 도와야 합니다. 따라서, 변호사는 당사자의 실제 상황에 따라 수수료를 감면하거나 면제해야 합니다.

<br>

**변호사 시험용 객관식 질문 구성**

<br>

변호사 시험을 위해 특별히 설계된 객관식 질문 세트를 만듭니다. 이 질문들은 다양한 법률 주제를 다루며 사용자의 법적 원칙 이해 및 적용 능력을 시험합니다.

<br>

**질문:** '홍성중학교'가 열등한 제품으로 축구장을 건설하여, 자극적인 냄새가 퍼지고 토양이 심각하게 오염되었습니다. 이에 '甲' 환경보호협회가 시 중급 인민법원에 소송을 제기하며, 학교에게 새로운 축구장을 철거하고 오염된 토양에 대한 복구 조치를 취할 것을 요구했습니다. 법원이 사건을 접수한 후 7일째에 시 환경보호국에 서면으로 통지했습니다. 이 시점에서, 시 인민검찰원도 이 사건과 관련하여 공익 소송을 제기했고, 법원은 검찰원을 공동 원고로 지정했습니다. 양 당사자가 협상을 통해 도달한 화해 협정에 대해 법원은 심사하지 않고 공고를 발행했습니다. 공고 기간이 만료된 후, 양 당사자의 요청에 따라 법원은 조정서를 만들지 않았습니다. 이 사건과 관련하여, 시 중급 인민법원의 어떤 조치가 불법적인가에 대한 질문입니다. 

<br>

선택지는 다음과 같습니다: 

A. 사건 접수 후 7일째에 시 환경보호국에 서면으로 통지한 것

B. 화해 협정에 대한 심사 없이 공고를 발행한 것

C. 시 인민검찰원을 공동 원고로 지정한 것

D. 양 당사자의 요청에 따라 조정서를 만들지 않은 것.

<br>

**답변:** 《민사소송해석》 제286조에 따르면, 인민법원이 공익소송 사건을 접수한 후에는 10일 이내에 관련 행정 주관 부서에 서면으로 통지해야 합니다. 시 중급 법원이 접수 후 7일째에 통지한 것은 법적 요건을 충족합니다. 

<br>

A 선택지는 합법적이므로 부적절한 선택입니다.《민사소송해석》 제289조 제2항에 따르면, 당사자가 화해 또는 조정 협약에 도달한 후, 인민법원은 그 협약을 공고해야 합니다. 공고 기간은 최소 30일이어야 합니다. 따라서, 법원이 공고 전에 심사를 하지 않은 것은 법을 위반하지 않습니다. 

B 선택지는 합법적이므로 부적절한 선택입니다.《민사소송법》 제55조 제2항에 따르면, 인민검찰원은 생태 환경 및 자원 보호, 식품약품 안전 분야에서 많은 소비자의 합법적 권리를 침해하는 등 사회 공공 이익을 손상시키는 행위를 발견하고, 관련 기관이나 조직이 소송을 제기하지 않은 경우에 한해 인민법원에 소송을 제기할 수 있습니다. 이미 환경보호협회가 공익소송을 제기한 이 경우에, 검찰기관은 단지 소송을 지지하는 입장에서만 참여할 수 있으며, 공동 원고가 될 수 없습니다. 

C 선택지는 불법적이므로 적절한 선택입니다.《민사소송해석》 제289조 제3항에 따르면, 공고 기간이 끝난 후, 인민법원은 심사를 거쳐 화해나 조정 협약이 사회 공공 이익에 반하지 않는다고 판단되면 조정서를 발급해야 합니다. 따라서, 공익소송에서 조정서를 발급하지 않은 것은 불법입니다. 

D 선택지는 불법적이므로 적절한 선택입니다.

<br>

이러한 다양한 소스와 구축 방법을 통합함으로써, 데이터셋은 다양한 법률 맥락을 포괄하게 되어, 개발된 모델이 다양한 법률 시나리오를 효과적으로 이해하고 처리할 수 있도록 합니다.

<br>

데이터 구성 요소가 수집되면, 데이터셋은 엄격한 정제 과정을 거칩니다. 이 과정에는 짧고 불분명한 응답을 필터링하여, 오직 고품질이고 의미 있는 텍스트만이 포함되도록 하는 작업이 포함됩니다.

<br>

데이터셋을 향상시키기 위해, 기존 데이터셋을 기반으로 추가 데이터를 생성하기 위해 ChatGPT API를 활용하는 '보조 구축' 방법을 사용합니다.

<div id="Training Process"></div>

## Training Process

### ChatLaw LLM

ChatLaw는 사용자가 제기한 상담 문제에 대한 응답을 출력하는 최종 언어 모델입니다.

<br>

이 모델은 관련 법조항을 참조하고, 자체 요약 및 질문-답변 기능을 활용하여 사용자 상담에 대한 조언을 생성합니다.

<br>

'Ziya-LLaMA-13B'라는 기존 모델을 기반으로 Low-Rank Adaptation (LoRA) 방법을 사용하여 미세 조정되었습니다.

<br>

이 훈련 과정은 여러 A100 GPU를 사용하여 수행되었으며, deepspeed를 활용하여 훈련 비용을 절감했습니다.

*deepspeed: 마이크로소프트에서 개발한 오픈 소스 딥러닝 최적화 라이브러리로 메모리 사용을 최적화하여 GPU 메모리 제약을 극복하고 더 큰 모델을 훈련시킬 수 있도록 도와줌

<br>

또한, 모델 환각 문제를 완화하기 위해 '자체 제안(self-suggestion)' 역할을 도입했습니다.

### Keyword LLM

사용자 쿼리에서 관련 정보를 검색하기 위해 지식 기반과 특정 분야에 특화된 LLM을 결합하여 ChatLaw 제품을 만듭니다.

<br>

초기에는 MySQL과 Elasticsearch와 같은 전통적인 소프트웨어 개발 방법을 시도했지만, 결과가 만족스럽지 않았습니다.

<br>

따라서, 사전 훈련된 BERT 모델을 사용하여 임베딩을 진행한 후, Faiss 등의 방법을 사용하여 코사인 유사도를 계산하고 사용자 쿼리와 관련된 상위 k 법규를 추출합니다.

*Faiss: 페이스북 인공지능 연구팀에 의해 개발된 라이브러리로서 수백만 또는 수십억 개의 벡터를 포함하는 대규모 데이터베이스에서 유사한 항목을 빠르게 검색할 수 있도록 설계

<br>

사용자 질문이 모호할 때는 이 방법이 최적이 아닐 수 있으므로, 사용자 쿼리에서 핵심 정보를 추출하고 이 정보의 벡터 임베딩을 사용하여 매칭 정확도를 향상시키는 알고리즘을 설계하는 것을 목표로 합니다.

<br>

LLM의 사용자 쿼리 이해 능력의 중요한 장점을 활용하여, 사용자 쿼리에서 키워드를 추출하기 위해 LLM을 미세 조정합니다.

<br>

**Algorithm**

1. BERT 모델을 임베딩 및 키워드 추출을 위해 초기화합니다.

   <br>

2. 법률 데이터베이스를 $L$로 초기화, $l_i ∈ L$ ($i$번째 법률), $M$은 법률 데이터베이스 내 법률 수

   <br>

3. 법률 점수 $S$를 초기화, $s_i ∈ S$ ($i$번째 법률에 해당하는 점수), 모든 점수는 0으로 시작, $S$의 원소 수도 $M$

   <br>

4. 사용자 쿼리에서 키워드 추출 모델을 사용하여 키워드를 추출한 후, 각 키워드를 BERT 모델에 입력하여 총 $N$개의 키워드에 대한 벡터 모음 $K$를 얻습니다. ($k_i$는 $i$번째 키워드에 대한 벡터)

    <br>

5. $s$에 가중치를 부여하기 위해 $α$를 초기화합니다.

    <br>

<img style="width: 50%; margin-bottom: 40px;" id="output" src="./chatLaw/algo.PNG">

6. 키워드의 정보와 사용자 질문의 문맥 정보를 모두 포함한 $v_i$를 계산합니다.  

    <br>
   
7. 각 법률 $l_j$와 $v_i$의 코사인 유사도를 계산하여 $s_j$에 더합니다.

    <br>
   
8. 계산된 점수 $S$에서 상위 $K$개의 법률을 반환합니다.

결과 예시)

<br>

입력: "회사가 무고하게 위임받은 직원의 보수를 공제했어요, 어떻게 해야 하나요?"

키워드: "회사, 공제, 위임, 보수, 해결"

법률: "《노동 계약법》(2012-12-28) 제41조 제5항 규정 중 하나에 따르면, ..."

<br>

입력: "누군가 제 동의 없이 제 사진을 상업 활동에 불법으로 사용했어요, 제가 무엇을 해야 하나요?"

키워드: "동의하지 않음, 명예권 침해, 초상권, 네트워크, 사진, 불법 활동"

법률: "《최고 인민법원의 적용에 관하여》(2009-12-26) 제36조 네트워크 사용자, ..."

### Law LLM

937k 국가 사례 법률 예시 데이터셋을 사용하여 BERT 모델을 훈련시켜, 사용자 쿼리에서 해당하는 법규와 사법 해석을 추출하는 모델입니다.

<div id="Experiment and Analysis"></div>

## Experiment and Analysis

국가 법률 시험 문제를 10년간 수집하여 2000개의 문제와 그 표준 답안을 포함하는 테스트 데이터셋을 구축했습니다.

<br>

이 데이터셋은 모델이 법률 관련 다지선다형 문제를 처리하는 능력을 측정하는 데 사용됩니다.

<br>

모델들의 정확도가 일반적으로 낮게 나타났습니다.
이러한 상황에서 단순히 정확도를 비교하는 것은 의미가 적다고 판단했습니다.

<br>

**Elo 점수**

<br>

e-스포츠의 매치메이킹 메커니즘과 Chatbot Arena의 디자인에서 영감을 받아 Elo 점수를 기반으로 한 평가 메커니즘을 개발했습니다.

*e-스포츠의 매치메이킹 메커니즘: 모델 간의  승패 기록에 따라 점수가 상승하거나 하락하는 방식

*Chatbot Arena의 디자인: 서로 다른 챗봇을 서로 대화하게 함으로써, 각 챗봇의 응답 능력과 대화 품질을 평가

<br>

이 메커니즘은 법률 관련 다지선다형 문제를 처리하는 모델들의 능력을 더 효과적으로 평가하기 위해 설계되었습니다.

<img style="width: 100%; margin-top: 40px;" id="output" src="chatLaw/elo.PNG">