import pandas as pd
df = pd.read_csv("경찰청_범죄 발생 지역별 통계_20231231.csv", encoding='cp949')
df = df[[col for col in df.columns if col.startswith('부산') or col.startswith('범죄')]]
crimes_to_remove = ['환경범죄', '노동범죄', '안보범죄', '선거범죄', '기타범죄']
df = df[~df['범죄대분류'].isin(crimes_to_remove)]
df=df.drop('범죄중분류',axis=1)
df = df.groupby('범죄대분류').sum()
total_row = df.sum(axis=0)
df.loc['총합'] = total_row
file_path = "C:/Users/MASTER/OneDrive/바탕 화면/oss개발/부산 지역구별 범죄 발생 분류3.csv"
df.to_csv(file_path, encoding='cp949')
