import NavBar from "@/components/NavBar/NavBar";
import "./style.scss";

const features = [
  { title: "收支记录", desc: "新增、编辑、删除与查询账单，记录金额、类别、时间与备注" },
  { title: "分类管理", desc: "支出 / 收入各自维护类别，支持自定义名称与图标" },
  { title: "按月筛选", desc: "按月份查看账单列表，快速回顾每笔开销" },
  { title: "数据概览", desc: "汇总每月收入、支出与结余" },
  { title: "登录鉴权", desc: "token 校验，401 自动清理登录态并跳转登录页" },
];

const techGroups = [
  { label: "前端", tags: ["React 18", "TypeScript", "Vite", "React Router", "axios", "antd-mobile"] },
  { label: "后端", tags: ["Spring Boot", "MyBatis-Plus", "MySQL", "JWT"] },
];

const About = () => {
  return (
    <div className="about">
      <NavBar>关于</NavBar>
      <div className="content">
        <header className="about-header">
          <div className="app-logo">记</div>
          <h1 className="app-name">简单记账</h1>
          <p className="app-version">Version 1.0.0</p>
          <p className="app-slogan">记录每一笔收支，看清每一分去向</p>
        </header>

        <section className="about-card">
          <h2 className="card-title">项目介绍</h2>
          <p className="card-text">
            简单记账是一个前后端分离的记账应用，用于记录日常收支、管理分类、按时间查看账单。
            项目完整走通了「前端 → 接口 → 数据」全链路，覆盖登录鉴权、账单增删改查、分类管理与月度统计等核心场景。
          </p>
        </section>

        <section className="about-card project-note">
          <h2 className="card-title">个人项目</h2>
          <p className="card-text">
            这是一个由个人独立完成的练习项目：从需求设想、页面设计到接口与数据库设计均为亲手实现，
            没有团队协作，也不以商业化为目标。代码与功能会随学习进度持续调整，欢迎交流与指正。
          </p>
        </section>

        <section className="about-card">
          <h2 className="card-title">主要功能</h2>
          <ul className="feature-list">
            {features.map(item => (
              <li className="feature-item" key={item.title}>
                <span className="dot" />
                <span>
                  <strong>{item.title}</strong>
                  <br />
                  {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-card">
          <h2 className="card-title">技术栈</h2>
          {techGroups.map(group => (
            <div className="tech-group" key={group.label}>
              <p className="tech-label">{group.label}</p>
              <div className="tech-tags">
                {group.tags.map(tag => (
                  <span className="tech-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="about-card">
          <h2 className="card-title">项目信息</h2>
          <div className="meta-list">
            <div className="meta-item">
              <span className="meta-label">项目性质</span>
              <span className="meta-value">个人学习实践项目</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">当前版本</span>
              <span className="meta-value">1.0.0</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">开发模式</span>
              <span className="meta-value">独立开发</span>
            </div>
          </div>
        </section>

        <footer className="about-footer">
          <p>如果你也在学习全栈开发，欢迎一起交流。</p>
          <p>感谢使用简单记账</p>
        </footer>
      </div>
    </div>
  );
};

export default About;
