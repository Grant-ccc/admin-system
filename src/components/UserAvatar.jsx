export default function UserAvatar({ name, avatar, size = 40 }) {
    const colors = ['#1677ff', '#fa541c', '#13c2c2', '#722ed1', '#eb2f96']
    const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length]

    if (avatar) {
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