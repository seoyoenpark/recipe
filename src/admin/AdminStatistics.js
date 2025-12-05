import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminStatistics.css';

// 더미 데이터
const userStatsData = [
  { name: '남성', value: 520, color: '#4ECDC4' },
  { name: '여성', value: 680, color: '#FF6B6B' }
];

const topRecipesData = [
  { name: '김치찌개', value: 1250, color: '#A8E6CF' },
  { name: '된장찌개', value: 980, color: '#FFD3B6' },
  { name: '불고기', value: 890, color: '#FFAAA5' },
  { name: '비빔밥', value: 850, color: '#FF8B94' },
  { name: '삼계탕', value: 780, color: '#A8D8EA' },
  { name: '떡볶이', value: 720, color: '#AA96DA' },
  { name: '파스타', value: 680, color: '#FCBAD3' },
  { name: '카레', value: 620, color: '#FFFFD2' },
  { name: '김치볶음밥', value: 580, color: '#B5EAD7' },
  { name: '제육볶음', value: 540, color: '#C7CEEA' }
];

const ageGroupData = [
  { age: '~19세', users: 386 },
  { age: '20대', users: 615 },
  { age: '30대', users: 207 },
  { age: '40대', users: 119 },
  { age: '50대', users: 86 },
  { age: '60대~', users: 37 }
];

const topIngredientsData = [
  { name: '소고기', count: 920 },
  { name: '대파', count: 890 },
  { name: '김치', count: 850 },
  { name: '고추장', count: 800 },
  { name: '양파', count: 750 },
  { name: '돼지고기', count: 680 },
  { name: '마늘', count: 620 },
  { name: '간장', count: 580 },
  { name: '계란', count: 390 },
  { name: '두부', count: 220 }
];

const COLORS = ['#609966', '#FFC36D', '#FF8A80', '#4ECDC4', '#45B7D1', '#AA96DA', '#FCBAD3', '#A8E6CF', '#FFD3B6', '#C7CEEA'];

function AdminStatistics() {
  return (
    <div className="admin-statistics-container">
      <h2>통계 및 분석</h2>

      <div className="statistics-grid">
        
        {/* 사용자 통계 */}
        <div className="stat-card">
          <h3>사용자 통계</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userStatsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userStatsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 가장 많이 조회된 레시피 Top10 */}
        <div className="stat-card">
          <h3>가장 많이 조회된 레시피 Top10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topRecipesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name }) => name}
              >
                {topRecipesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 연령대별 사용자 */}
        <div className="stat-card">
          <h3>연령대별 사용자</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#FFC36D" label={{ position: 'top' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 가장 많이 등록된 식재료 Top10 */}
        <div className="stat-card">
          <h3>가장 많이 등록된 식재료 Top10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topIngredientsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" label={{ position: 'top' }}>
                {topIngredientsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default AdminStatistics;