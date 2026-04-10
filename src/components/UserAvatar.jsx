export default function UserAvatar({ name, avatar, size = 40 }) {
    const colors = ['#1677ff', '#fa541c', '#13c2c2', '#722ed1', '#eb2f96']
    //获得名字第一个字符的Unicode编码 为0就返回0 不为0 对着数组长度取模 确保在0~4间循环
    //同一个用户名每次都会得到相同的颜色，不同用户大概率不同颜色，视觉上既统一又有区分度。
    const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length] 

    if (avatar) { //有img头像
        return (
            <img 
              src={avatar}
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />  
        )
    }
    return (
        <div style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: size * 0.45
        }}>
            {name?.[0]}
        </div>
    )
}