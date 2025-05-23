import pandas as pd
import numpy as np
import streamlit as st
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import os

# 한글 폰트 설정
plt.rcParams['axes.unicode_minus'] = False

# 폰트 파일 경로 설정 (레포지토리 루트에 있다고 가정)
font_path = 'NanumGothic.ttf'

def load_font(font_path):
    try:
        font_add = fm.fontManager.addfont(font_path)
        fm.fontManager.cache.clear() # _rebuild 대신 사용
        plt.rcParams['font.family'] = fm.fontManager.get_fontnames()
        return True
    except Exception as e:
        st.error(f"폰트 로딩 실패: {e}")
        return False

if os.path.exists(font_path):
    if load_font(font_path):
        plt.rcParams['font.family'] = 'NanumGothic' # Matplotlib 폰트 설정
        st.success("한글 폰트 적용 완료!")
    else:
        st.warning("한글 폰트 로딩에 실패했습니다. 폰트 파일이 올바른 위치에 있는지 확인해주세요.")
else:
    st.warning(f"폰트 파일 '{font_path}'을 찾을 수 없습니다. 레포지토리에 'NanumGothic.ttf' 파일을 추가해주세요.")

busan_location = ['중구','서구','동구','영도구','부산진구','남구','북구'
,'강서구','해운대구','금정구','사하구', '연제구','수영구','사상구','기장군']
guilty_types = ['강력범죄','교통범죄', '마약범죄','병역범죄','보건범죄','절도범죄',
                    '지능범죄','특별 경제범죄','폭력범죄','풍속범죄']
df = pd.read_csv("부산 지역구별 범죄 발생 분류3.csv", sep =',', encoding = "cp949", index_col = 0)

#총합행을 무시하고,차트 생성
df_without_total = df.drop(index='총합', errors='ignore')
total_crime = df.loc['총합']
total_values = total_crime.values.tolist()

#ui/streamlit
st.title("⚠️부산 내 범죄 통계⚠️")
st.header("부산 지역별 범죄 통계 비율")
selected_location =st.selectbox("부산 지역구를 선택하세요",busan_location)
plt.figure(figsize=(10, 10))
plt.pie(df_without_total[selected_location], labels=df_without_total.index.tolist(), autopct='%1.1f%%', startangle=90)
plt.axis('equal')
st.pyplot(plt)

st.header("범죄사건별 부산 내 지역 비교")
cols = st.columns(4)  # 4개의 컬럼 생성
clicked_guilty = None
for i, guilty_type in enumerate(guilty_types):
    with cols[i % 4]:
        if st.button(guilty_type):
            clicked_guilty = guilty_type
if clicked_guilty:
    if clicked_guilty in df_without_total.index.tolist():
        crime_data_for_type = df_without_total.loc[clicked_guilty]
        plt.figure(figsize=(10, 6))
        plt.barh(busan_location, crime_data_for_type[busan_location].values, color='steelblue')
        plt.xlabel(f"{clicked_guilty}별 발생건수")
        plt.ylabel("부산 지역구")
        plt.title(f"{clicked_guilty} 발생 건수 (지역별 비교)")
        plt.tight_layout()
        st.pyplot(plt)
    else:
        st.warning(f"'{clicked_guilty}'에 대한 데이터가 없습니다.")
else:
    st.info("버튼을 클릭하여 특정 범죄별 지역 비교 그래프를 확인하세요.")
