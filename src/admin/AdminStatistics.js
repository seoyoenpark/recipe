// import React, { useState, useEffect } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar, Pie } from 'react-chartjs-2';
// import { useGlobalLoading } from '../components/LoadingProvider.js';
// import './AdminStatistics.css';

// // Chart.js 등록
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // 더미 데이터 (서버 연결 전 사용)
// const dummyData = {
//   totalIngredients: 1542,
//   totalRecipes: 2439,
//   topIngredients: [
//     { name: '돼지고기', count: 245 },
//     { name: '계란', count: 198 },
//     { name: '우유', count: 187 },
//     { name: '김치', count: 165 },
//     { name: '양파', count: 143 },
//     { name: '당근', count: 128 },
//     { name: '감자', count: 115 },
//     { name: '닭고기', count: 98 },
//     { name: '두부', count: 87 },
//     { name: '파', count: 76 }
//   ],
//   ingredientConsumption: {
//     consumed: 73,
//     unconsumed: 27
//   },
//   topRecipes: [
//     { name: '김치찌개', count: 342 },
//     { name: '된장찌개', count: 298 },
//     { name: '제육볶음', count: 276 },
//     { name: '불고기', count: 254 },
//     { name: '계란말이', count: 231 },
//     { name: '비빔밥', count: 218 },
//     { name: '순두부찌개', count: 195 },
//     { name: '잡채', count: 178 },
//     { name: '갈비찜', count: 156 },
//     { name: '떡볶이', count: 143 }
//   ],
//   recipeClick: {
//     checked: 68,
//     unchecked: 32
//   }
// };

// // 서버에서 통계 데이터를 가져오는 함수
// const fetchStatisticsData = async () => {
//   try {
//     // 실제 서버 연동 시 주석 해제하고 사용
//     // const response = await fetch('/api/admin/statistics');
//     // if (!response.ok) throw new Error('데이터 로드 실패');
//     // const data = await response.json();
//     // return data;
    
//     // 현재는 더미 데이터 반환
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(dummyData), 1500); // 네트워크 지연 시뮬레이션
//     });
//   } catch (error) {
//     console.error('통계 데이터 로드 실패:', error);
//     throw error;
//   }
// };

// const AdminStatistics = () => {
//   const { show, hide } = useGlobalLoading();
//   const [error, setError] = useState(false);
//   const [statsData, setStatsData] = useState(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     show(); // 로딩 시작
//     setError(false);
//     try {
//       const data = await fetchStatisticsData();
//       setStatsData(data);
//     } catch (err) {
//       setError(true);
//     } finally {
//       hide(); // 로딩 종료
//     }
//   };

//   // 차트 옵션
//   const barChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.85)',
//         padding: 12,
//         titleColor: '#fff',
//         bodyColor: '#FFD700',
//         titleFont: {
//           size: 14,
//           weight: '500'
//         },
//         bodyFont: {
//           size: 16,
//           weight: '700'
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(0, 0, 0, 0.05)'
//         }
//       },
//       x: {
//         grid: {
//           display: false
//         }
//       }
//     }
//   };

//   const pieChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           padding: 15,
//           font: {
//             size: 13
//           }
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.85)',
//         padding: 12,
//         titleFont: {
//           size: 14
//         },
//         bodyFont: {
//           size: 16,
//           weight: '700'
//         }
//       }
//     }
//   };

//   // 차트 데이터 생성 함수
//   const getTopIngredientsChartData = () => {
//     if (!statsData) return null;
//     return {
//       labels: statsData.topIngredients.map(item => item.name),
//       datasets: [
//         {
//           label: '사용 횟수',
//           data: statsData.topIngredients.map(item => item.count),
//           backgroundColor: '#FF6B35',
//           borderRadius: 6,
//         }
//       ]
//     };
//   };

//   const getIngredientConsumptionChartData = () => {
//     if (!statsData) return null;
//     return {
//       labels: ['소비됨', '미소비'],
//       datasets: [
//         {
//           data: [
//             statsData.ingredientConsumption.consumed,
//             statsData.ingredientConsumption.unconsumed
//           ],
//           backgroundColor: ['#4CAF50', '#FF6B6B'],
//           borderWidth: 0,
//         }
//       ]
//     };
//   };

//   const getTopRecipesChartData = () => {
//     if (!statsData) return null;
//     return {
//       labels: statsData.topRecipes.map(item => item.name),
//       datasets: [
//         {
//           label: '조회 수',
//           data: statsData.topRecipes.map(item => item.count),
//           backgroundColor: '#2196F3',
//           borderRadius: 6,
//         }
//       ]
//     };
//   };

//   const getRecipeClickChartData = () => {
//     if (!statsData) return null;
//     return {
//       labels: ['확인함', '미확인'],
//       datasets: [
//         {
//           data: [
//             statsData.recipeClick.checked,
//             statsData.recipeClick.unchecked
//           ],
//           backgroundColor: ['#2196F3', '#E0E0E0'],
//           borderWidth: 0,
//         }
//       ]
//     };
//   };

//   // 에러 화면
//   if (error || (!statsData && !show)) {
//     return (
//       <div className="admin-statistics-container">
//         <div className="error-screen">
//           <div className="error-content">
//             <p>데이터를 불러올 수 없습니다.</p>
//             <button onClick={loadData} className="retry-button">
//               다시 시도
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 데이터가 아직 없으면 빈 화면 (LoadingProvider가 로딩 표시)
//   if (!statsData) {
//     return null;
//   }

//   return (
//     <div className="admin-statistics-container">
//       <h1 className="page-title">통계 대시보드</h1>

//       {/* 요약 통계 카드 */}
//       <div className="stats-summary">
//         <div className="summary-card">
//           <div className="summary-icon summary-icon-ingredients">🥕</div>
//           <div className="summary-content">
//             <h3>총 식재료 수</h3>
//             <p className="summary-number">{statsData.totalIngredients.toLocaleString()}</p>
//           </div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-icon summary-icon-recipes">📖</div>
//           <div className="summary-content">
//             <h3>총 레시피 수</h3>
//             <p className="summary-number">{statsData.totalRecipes.toLocaleString()}</p>
//           </div>
//         </div>
//       </div>

//       {/* 식재료 통계 섹션 */}
//       <div className="statistics-section">
//         <h2 className="section-title">식재료 통계</h2>
//         <div className="charts-row">
//           <div className="chart-card">
//             <h3 className="chart-title">Top 10 인기 식재료</h3>
//             <div className="chart-container">
//               <Bar data={getTopIngredientsChartData()} options={barChartOptions} />
//             </div>
//           </div>
//           <div className="chart-card">
//             <h3 className="chart-title">식재료 소비율</h3>
//             <div className="chart-container">
//               <Pie data={getIngredientConsumptionChartData()} options={pieChartOptions} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 레시피 통계 섹션 */}
//       <div className="statistics-section">
//         <h2 className="section-title">레시피 통계</h2>
//         <div className="charts-row">
//           <div className="chart-card">
//             <h3 className="chart-title">Top 10 인기 레시피</h3>
//             <div className="chart-container">
//               <Bar data={getTopRecipesChartData()} options={barChartOptions} />
//             </div>
//           </div>
//           <div className="chart-card">
//             <h3 className="chart-title">레시피 확인율</h3>
//             <div className="chart-container">
//               <Pie data={getRecipeClickChartData()} options={pieChartOptions} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminStatistics;