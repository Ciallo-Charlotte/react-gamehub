import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Avatar, Badge, Tag, Pagination, Spin } from 'antd';
import { EyeOutlined, MessageOutlined, CalendarOutlined } from '@ant-design/icons';
import './NewsPage.css';

const { Title, Paragraph, Text } = Typography;

// 模拟热门资讯数据
const mockNewsData = [
  {
    id: 1,
    title: '《赛博朋克2077》DLC「自由幻局」正式发布，夜之城迎来新篇章',
    summary: 'CD Projekt Red今日正式发布了备受期待的《赛博朋克2077》大型DLC「自由幻局」，为玩家带来全新的故事内容和游戏体验。这次的DLC不仅包含新的主线任务，还有全新的武器、装备和游戏机制，为玩家提供了数十小时的新鲜内容。',
    cover: 'https://cdn.max-c.com/heybox/game/header/1091500_3olJW.jpg',
    date: '2024-01-15',
    views: 12345,
    comments: 432,
    category: '游戏新闻',
    tags: ['赛博朋克2077', 'DLC', '开放世界'],
    author: {
      name: '游戏记者小王',
      avatar: 'https://picsum.photos/id/1/32/32'
    }
  },
  {
    id: 2,
    title: '《艾尔登法环》首个DLC「黄金树之影」销量突破500万份',
    summary: 'FromSoftware官方宣布，《艾尔登法环》首个DLC「黄金树之影」自发布以来销量已突破500万份，玩家好评如潮。这个DLC为玩家带来了全新的地图区域和BOSS挑战，难度依然保持了FromSoftware的一贯风格。',
    cover: 'https://heyboxbj.max-c.com/gameimg/steam_item_assets/6026263faf7142fbf97ddb6948dbf05a.jpg',
    date: '2024-01-14',
    views: 9876,
    comments: 321,
    category: '销量数据',
    tags: ['艾尔登法环', 'DLC', '魂系游戏'],
    author: {
      name: '游戏分析师小李',
      avatar: 'https://picsum.photos/id/2/32/32'
    }
  },
  {
    id: 3,
    title: '《GTA6》官方确认开发进度顺利，预计2025年发布',
    summary: 'Rockstar Games今日在官方博客上确认，《GTA6》的开发工作进展顺利，游戏预计将在2025年正式发布。尽管官方没有透露太多游戏细节，但据业内人士分析，《GTA6》将采用全新的游戏引擎，提供更加逼真的开放世界体验。',
    cover: 'https://cdn.max-c.com/pc_game/head/ec71eb6518c3c1d7b7a008311b364805.jpeg?imageMogr2/format/webp/quality/50/auto-orient/ignore-error/1',
    date: '2024-01-13',
    views: 23456,
    comments: 876,
    category: '游戏前瞻',
    tags: ['GTA6', 'Rockstar', '开放世界'],
    author: {
      name: '游戏爆料人小张',
      avatar: 'https://picsum.photos/id/3/32/32'
    }
  },
  {
    id: 4,
    title: '《星空》最新更新修复大量bug，玩家体验显著改善',
    summary: 'Bethesda今日推送了《星空》的大型更新，修复了游戏中的大量bug和优化了性能问题，玩家体验得到显著改善。这次更新还添加了一些新的任务和内容，让玩家可以继续探索游戏中的广阔宇宙。',
    cover: 'https://heyboxbj.max-c.com/gameimg/steam_item_assets/4017fcc6bd0721d0037f2e89a3fe1505.jpg',
    date: '2024-01-12',
    views: 8765,
    comments: 298,
    category: '更新公告',
    tags: ['星空', 'Bethesda', '开放世界RPG'],
    author: {
      name: '游戏测试员小陈',
      avatar: 'https://picsum.photos/id/4/32/32'
    }
  },
  {
    id: 5,
    title: '《英雄联盟》S14赛季正式开启，带来全新游戏机制',
    summary: '拳头游戏今日正式开启了《英雄联盟》S14赛季，带来了全新的游戏机制和平衡性调整，职业联赛也将随之展开。新赛季引入了「元素崛起」系统，让游戏的战术更加多样化，同时也对多个英雄进行了重做。',
    cover: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGRcbFxcXFhgaHRgfIBkXGBgYGBcYHSggGB4lGx0XITEhJSkrLi4uGh8zODMtNygtLisBCgoKDg0OGxAQGy0lICUtKy0tLS0tLS0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgABB//EAEUQAAECBAMFBQUDCAsAAwAAAAECEQADBCESMUEFIlFhcQYTgZGhMrHB0fAHFEIjUnOCsrPh8RUkM0NTYmNykqLCNJOj/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDAAQF/8QAKBEAAgICAgIBAwQDAAAAAAAAAAECEQMhEjFBUQQTImGBobHRMnGR/9oADAMBAAIRAxEAPwDEzN53AObk6/V8oVLpMK8OI4Cxu54sC3jfn1hyJYvFdZS4wGzHHXly0ikuiCFtfSKC1KSk4STZIJbwGUFbJnZpdnO6D7gePI521MNqB8N0srI9ePjnaL+7BN0pPUAmJ+dDVoo74i/m5PmIgZlwXg4pSWdIPp5tnFJpkKOqelx5fIxRP2TcfQMubwP1aJCaWzL9YtTQAg77LswNkm4BvmC1/A8YkjZjkAzAOiSWL82tD8ooXgy2gqHStPEBSeqcx5ExdT1ZBtyxcw+ULkpXKU5AJHMKHmkn6MQXVh90ED3coV7GSoZVk+9uXuAePKeeoMxIdxnCxU73j69IuM1gPCHSSVGp3Z9D7J9oMKe6WHCWwl7gE3DagH3toI1p2gkjdAUDHybZFZgmpUSwNjyez9Apj4RvJc4ixF48/NiV2jtxu0Pvvkuzyx/xSWiz75KRkkP/AJQD6wmkqJ0iz7m93ERUUW4ryPJFQlY3S3Fhfxi8Szxfr/KM+mmKcjDGknKa5J+ucBw9Cteg5VKDmR4CJIokDR+sRSot9fCBausMtUtLAlagCRoHAJz5+hh0Jtkdt04+7zmwhkE5MLXbxy8Y+bqWFKSCCAAp36DgY+kbdWRTT9fya+H5p4mPlwmTJkwSgxUogJvqogM9rcY7Pj/4s5PkdoMr3mLXMdt4nCHa5yd/hDddB3NXIlpJwr7hbE3BKilT+KcXVRhVtijTInzJb4gkS2JIu6XJLcY0W2pjVGz5ouVIlPw9tBH7SvSHk/QuNbdmxl0zfijJdr0NUJxG5QMOrAFT2yckqvn5w/Xt2WJ3dF/wgq4KU5SnDnkHxZBx4I+0NMJtagFQCWkgKChkpahZ8lFi3R7xyY07OuTIdmNpokGb3qt1XdMUgqYtMdwlyHt6cI2NOtExIWhTpUAQQ9/l0j5httM1E3u8+7SlIAyJwpxEC/tG+lsIa0RodoTJKgsTDLvvpFwpiHcNhy1zaLZMFKyePIpt17Pqgk8zCzbm0zISGIKlOwJsG1OraQxWs8ownameTULBNhhAy/MSph4k+ZjmSR0448ns2dXtEJl94LggFNs3Dp+cfMtvTVKm4rkqUR43OnP3w42ptAqpk3ylhKWezIv4lj6QhQCqVTkBz3iE+JWsB/JMPHRRR4oSy1kKAJs44HWHVYXFy31pGalK3w9rp9WOhhnWVjzFkeyVKKehJbpaLq7I2kqZ1UpPsgN7wYFxWblEJkxyTrAyp14vF6OeStlhVu6xp+yS3lLP+of2URjjNYfE5c40vYSqSuQtST/eHjbcllvdAk9CJbMWbGLEzTyjljQ5xDK8ZiJhKKhs/SJKqQLgHnAq0xXi0jKKYrk/A1lzgq498RVOSNR5wmWI5MHiFSGc2tGl4iKz6/nC+PUxqQeTCZ0+Kgo5xAExKSQVgEsL3J4gsT4sYzdGWyTPBAvbp84rkJzgtCbA66wjlQ8USFx090fRuyG2AuThmKHeS2BcB1D8KueoPR9YwKJbXg/Zk/u5iV5DI9Pi2fhEclTReCpn1KlqQ+l+UGdyk5M+rH5Rl5dSkXJt9awfSVktY3VX8QfIxxP2dDiPRIHD1iQlcPfCxFYcWIq6jT+EMpc/ikwU7EaZKdMKEKV+alRvyBMZWbNmrKFrJOLFhPDCUOGGV1DyjWVM1IlrLZIUcs908YzVHMCRIJySZz9GQ8WjHVmi6HtSkTKZYH4pSw+r4CD4vHzTs4AKyUojEMaM+JIA00JB8I2lNtYS6coI3wCxJtdg51zMYvZqkieCCPyZxkl2AQAsk/8AFurZx04U6aOP5Dppjbt2lP3k4RhPdSyeZeb/AOQkeEG7TDnZoz/JybdVScvI+nGM1VrmTE94tRXvFClkuQpgoJLfrkZtvDIJh72gLS6MZKEhN/1ZZGXAxWcODUWTxZFNOXsh2iSe9nlLsVpCeoThJfr6GE8uaVpSElikhyN1yygxYXzfwAFngldYZiVBWaUvZ+ID+sL6SSFAFQfeN/BIHq8aCpFJyt6HmzHnz5QUFKBICipV2xF3J9pgSnizQPtmV3FXMSkhOAuhjcApK0i2WFJA1LJHWDtmrBrZJljCCpFgbAYEqUPK3hAvayUBWTsTH2T/ANE/C0LJ2/0GxRUevZutlVH9XklWInu0OVHeJwgFzrfWMPt+fiqJv+4fu5fyjX9n5YVSUznOTJPmhJ+LRgO16mqpqZb5pfr3aHzjjgrdHbjaiXV9QUU8pnbFl/yv9cYUVleoUCEpUUlM+5BIN0rULjm58IJrifuCFk3EyZLAa7YX9CGbmOUIZ038itJ0mIIz/wBYH4RRR/kM52DKBSpjnwd2gtZjyulgS5UwAkKABOgUHDcicKi3APFqJRUkK4gHzDxVMg0DLW3SJd8VbspIcm1nL2ZyegJyyjp0gwGoFJs46Wh6TJNtCrtHRqlhPezQpSnISl8tS2guOr8o132Wn+rTf06v3cqMZtormTGOSEpc+eFPjYNG3+zSSU00x9Zyj/0lj4QtNLYiqzOBfGKJ5aW+psYmlVjAtQcuEGvQjYUmYCkF82HjlFcxDGAFLIFuIIv8IZomAgP8Ip0ToqYGPFhhEEkGawLDD6vyygkpsHGYhXIagdMSSIl3Llk8vlBMqjWSzX4ZeuUFzRkmCENExJJGJvpj8oMmyMNtdYM2dMAO8HTmXD5A6ePviblq0FFdRRqQrCwdLAt0Ai+nS2YiSlFasRzUfcBa3AYYMpA6kotvEJD5OSweJtlFZSotB1LRvJ7whiVMBooMLjxtFdagYS3Fj9aiJJrVAJa4ShIIzAuVeH8ImnaKq/QbTqIGE5acoNkrIIKcxlAuy5+MKB9oEEDkxc+BbzhtJRyhJNdFoNliavfHAjyN7PD2gqctGYK+Z+tIzAmatn/D5iCPvAKSq7oSk2e9wk5dRCuKWinLkuh7tXayClctKsRIIcDdzAIfo9xbnCkTGQl+Ez3EQLVzkywtKgQErAxEEJ3caTvGwuU6xVLqwsWukZMXDFySCLHqIvBL2RlKukW7VqWp2a6phu2QSkEjzKfIwDtGWhKZktKFOlCMayQcQ7wpWAWti3d1mGEZkwRWrC0oQzXWeRBCBY65QNtoJRLUolu8JQVOSwJE4DlvrUSrgiO348GpWeX8vItoD2XVhloKHlkheEfhUMKMSbgh0FvDJTMWvaPCRShOLCmWwKmxMEygHIs9tOMK9mU+HGo65EHkguGPP0hjtFRsMNkFQA5EqPoAkeEVzxdqTIfFzR+6EfANRyimVMID4t3VxcG3W2fDSKJIwoTzKj6gfCHWxiFSlWzWRn/lQQ/C8ItoVUsTcKSGFgH4PfxzjmUvuaPRa+1MM2ZPCZiJh/Atx4MRrAW1DMmzB3hUVqQkqUcyCCUl8mKSm3pFVLUB2I0B+vAjyi6rr04goA4cEhIYswEmWA/r5QJNWUxX6Nnsqu7ukkFJGFMpQU5sMBSknwIPnGI2xWJmT1zEk4StRDhnfCLv0t4RCVXEJVLGIIN8JU4BxJUCHyJKUvAdYd0g8beR+vARPHhSbdlnka8Be05iTRSik372pceErLk2E+MZ6tLbo1BUqz3C5jdLN5xdOqUpTlduLQtnzkkuE4TqBlcvx+HCG40T5uhlVVZNPJl3ASVkh7H81TZPdYfMw+7PzkzkYWAUgCw1DAA9ePhxjHGeSAGZrC/M/Mw+7ETmq0J/PStHTdxvz9hm5xLJGoP/AKPGf3DupoOUKanZxjfVVIDCiopmIdmfh0N/Xyjlj8nj2PPHZi5uycYvkkubsPHjxaNL2PSBKX+kP7CIG2mk+y2XxAJ6aQd2UH5Jf6Q/sojqxZXNWzmkkmfOxZ4AqZpxdILrF4VgZAcm4i/GApxfPOLJ7JM9UYskzGSdM4HQecSK2+POHbBRFM514sjy9fSGQqM2Lukjz15QqSq8OKCnWtAwJWpj+FJU3H2crt56aowsnSDfQOLDzsPVody1KE37sMIBQ5dJJKgpRYEqGHcSrLhxJe1OxJgln8ip1sSFFKcLFxmxcjyhLtmZMlrxE72QUVBRYJKRqdDEn93Rlph9UHViCgpJLBQUCCQEuH1IxJ8xEp8jCAUk3sXHslnbmDcjoeDlHsasw/k1PgUTcFigkJTiuWIYAFOuhEPpVQrE6jiBfEDd7NqNMxwvxMNqMaA75WNNmSEqUcIYFyAdHGXhx5RDasgoWnCWIYuNDobZGwMV0dUpCxgVxuwvYgBlPpBNTUFZ3t5RYA2B6MGBjkqX1OXgvGS415A0zlGxL39YKkWlLWhVnQQbWKe8GRDZsb6EQn21P7tScCiAXvbgl0nNKmOuWRhRTV65aVoBIQpNxoWFna/8ovCPkEpOml2bDZ1W81K8Hdgp9jLCO7KQ75HIngSY0U2tCUgoKFKPMKa3AGMXTTlLmDR7OzD2SOg+cGISsWscnYuInKHJ2VjkpUNVVu6EN7JPW4Fj0w++E/aGpPdMwIxJxakZs/C7Dx5xfKo5qiBiSHBKQZg3gM2Sl3a30ID2tTK7pe7klRxFXAFTs3LKGUUb6jM9LWhIxgAEcBfhYxouyCfyhNgko5AE5pBbPdxnwMZvZySpaUsCDjsR/kWfeB4wdsyqwyljilj+y3OylFtWjpjDRKT9Gjl7WJmA5JDFs3BGb6WbLxgjtRUjuksp3WrI5gJTe3H4RlETXcI3WBYk/wCwHIaqClfrNpFlXO9liSAXfqFE2Pl4R0wyJLo83LgcpqV9Gq2QsGm0BEpdhyxJfzHnDqvUlQxDeBLghQY5sxYuOesYqVU4VpGKxTMllN2KVYT+tiUX4juxxDPV7bEohAWooZijvFy0cCGwqxZ4rJ4Q+SalD/RDD8dwy37bZCp213KSljvK0IJyu1uAjH1E9eLEfaJxWF7kkjJ4f7fAXIRPSlkLO4CQouFFKgWsbuMhpGSUss4t/OOKNPaPX2tMdfeL/LPg8RqKshJYWcWJHBhaFEicpSgACSS1uD5QZWSFhJxJYOGu/Gzh9I0qsomxlSVeJDgOSClubfRgefMJZwQ2b+sLJM1QsCb2LPl4Z2gwyUC5mDxBHkDnBT49izk2B1k0epiieuwIH4bHxMW1aUqIEu7ZnIaZk5RTPWCAAzBLOHudTeMpIWzzHzjY7FmJ7/Zy/wDSUD1SuqTfmGHlGHKjDnZNeEmQSWEpXMljMMxVuilQmROS1+f4DGas+tT61iQfT3eTecA1NSEgEDkOl/ewgerIAJJfp4N11hTU1hNizDJtDHkQxc6Z1ufHs7aFWMsLM/w9cjBvZf8As1/pD+yjOEVTNxBWbk2PUgN5AQ67Jf2S/wBIf2UR6OGHFHNKVs+W1E4qWVOc9S59fdERnp9WitcwBzoLmPRNOYQogZmw95tF0Ta9HS2ByjxShEpwIN9bi758xnw8IqVDWA9lSyosIe7ImYEFgcQ3gsMQxthUoXF8n4mEUsgFy46dRr0eHexpKlpmSxOYFwzC+rEkZG/QgdRLK6QsnSDUbQscRR1Kg/m8LNrz0qbCRbgX5RPaFGJctR3nFs5bZgHIPrpC2avLXdSfQW84aKXaMi2hRvptr/FvKNYmrlIJS1wxcAnMODcNkeMY9M8py/OBt0UD7xDGRXrsd4swseX5pjTjyCan+miPZVMH6qR5HFFEzbMzEBjmXCiN5siOB5wnkVClFr/8R72tA9bVpE9GuFJcvmSzM/D4xJQSMmy3bazuuGDnUe4coVSprqY5ZfD5xftWoBCWF3Or6QHQoxLAORcnyJ/hFYrQbH4QQS6vf8zF6Fulr6ak/wAoXTZ7El/WB11RILE+cFIF2aDuglCJiVAXIe1y5fOwDMDoQ75wvqdrghQBUUlwPaYjSz5NCqdPJRgb38Xyyy4RWFjj9eUVzNNJLwSwwlFtt9sJoVErDOfayz9lcdST2SocbeoL+hHiYAl1GV4JpFupsy/jkoxJWdLDJa3xHkfdBtPMDhLDRnA18OcU0dCSQVAsQwuHJ01tBEyUhKSfx6Al+GeEDLNuUHmI4lAmgqSngb+LD4esONl7KCpyULmBQPAJSOYdvXlCiioZh3gHzuxZ887c4cyqoImpBbEynKU3AKGdk9TdshGvk0gNcYuQR2rQlEoS5LmUglt5RuVPMWxO4CWtkxfMPGQVNYNe+enGNHLrkHvbK9hQSGJxApUDiAytodOEIJst2DnCWYtpxf6yiuVRhXEngnOafIolFlgjkb3/AAg+94crqULT+USGTmWUw0c4fLKExWSsHoA+g0fjaDKtExIBxEaEAkAuOFnt74hJJnSmUCqQ5ZDDRWJjycX15xXMqCpnL8PoRRMAa3Q/CKMWQ5/WcU0JYatX5MMS+JT+QiqRMze768InMO6B1J5XYXHT1ED5PChJKd2zgmjNjAwNwRFtMWU3H6EEXo1grZqiN8qdm8gf/Xo8TpwcSw7sQ5ccxpbT0hXQTd2YH/CwbmQ/hYecG0M0nEeLfGI8K0guS8hEyVx5eOsPuyf9ktx/eH9lEZ5SzGm7Kkd0r/ef2UQyjJdgUk3o+MBW9hXYXdhnyubc4Zy7gsoAlIH8X8TAlVJBUzM/04L/AFeITKMhe6og8SGI6t74H+Q8iU+bfAzNFJUY6dLWGxfG3JjlEUpvFEKESVcLng0OtmLWllpCdWtfizE9D4GEspAzUroBr5ZQfTKIVia1wkKLt00drcw8SyK0JLYT2kStQE0qlqSpmKQlLcinNwbE3hJLJhptBcxit8KVWLIOFWeeYxXzZ8nhMFs3X5iGxajRorRdMWw+uUHyCACDa9mvazQqqVQXI0ZT2Dhra5H4e/R2NWhka4ID/XS0I6yrdeLLgHuBp0OvjDGkmAqKFy0qcYkqKQ4ZgznQ5/ziE+ZTAkKEsHXcUdHzCIk3Tqikcaq7D6TYJqJBnompIQlSlp3gUkIKynI5gWPMQgpqpjcsz8fgHjf9k8I2XtJaWIGRAaypKQOgvGHkTJDDEUAsHeWol9XZJBvCY8jbkvTLTxxpBlVQVKSxkTAX1lzT64IgKOeAVqQoJGaiiaALgZlDC5Az1EadNZOlbHROlrKcM0oC2BYd4pIDHQJ9wjO1XaWauVMRMnd8JiQkHBgwYVoU+W8GBDdOEaGTJJ9Kk6DLFjS78FVEpU0hMsOS7DDMLsMSmwIILAEnW2UXTdnhLGaVhyc0qlJsz3mJD56EG4tBvZqT97q6eQjRQWpbFKUIlushKbFLsElR/OsLl3G0Ais2fOnyxuy5hJ0bCo4VKByeUt21LcIGTK1NJ9f30aGKPFtdmVl01OpQSghROQSqaTx/C/Xwg2j2CpW9LStswoYmNtFL3VBtQTBnYGjTjnTlpBlyZeJbhwBc7w1ACcWE2JAfJiq2t2oqZ61KRMVLToAbtpiVmo84zcnLjDx3YyUePKQfM7+WUpKTvKCQ6VXJdgCkEEljZ9DEZilIZU1CkglnMtQ4ZYwAcxrCSt2vPmSe5mqKwFpUFKzDBaSH1BxvybnGt7WoSiRRGYwC5eIkpxAuiSXwtxPCM5Si4p+bF4Qkm14oWzKszMRkIUUgXCQpRF0DEoIGTrSHyc9YGCKlRWoIWoow94QlZKcQ3QoBDhwDnwMNOweFdWtEoBSVSTiCUYcpslWTB8hpCvsykrrpSEKOJapwWLh7LUAT+LL0jfUceSS6VmWKLSvyyg9/+avh7Ey/H8MXSqkg4CSk2soEZgF2IBuGPlHu19rTUVE6X3+Du5ikpRgUSMJ4jm8C0m0JSyqZOw4lEe0kqJZKQouElnUCWPGHjObVtAlCC0mN6KaMYd1AZsfVsPGGvaUASeZKWJIyZRO7nw0GYhFS10r2kBCgHfcbIPkQHgM7SVMckISCXwhKQE2ZhbIQU3KQklSD5NKkySoqYkLthxcQLDLLPSFtNKKlABnL5kDIE5mD6ecO6KTidltvEDNWgF/EwFRpClhPubmdYptXZF+C2aghwdAHYg6k2IsbRUVOG0f4Ae6L6lOFJ5sPByT64YFnpKSA/B/HMRlszJytPrWJp9p+beX0IoQrrFyBY55+WcOKMaRV+sN6A5+HxhJImOx6Q0ozc9PiI1bEm9B64e9k54MuYAcphBtrgQfcRGQ2vOXgwyg8xdkn80fiWToANeJEaXsFLTLp1y0AbsxlFsz3cskniS4gy0gYVbPnNZJUEhT2c55h/fw8BFEiccsTPxDxGVLxO6tfha55cokZI0jnivDOiR7PqAQzkcQFHCelvSBwmPZiIgDFkkuhCaRE1VCyGJtnwPpFXhEu+4iMwUWmcSkgqPHNV/Is/UQFjvFs8xQ8ChkWTFuBaL6WdYgnpYnidLxDZ6nmyxZsaLG4O8LEZEQ4qNjomVCZaAhCphsDMKUAkOkFgSHsABqQLQkpU6KKFqyGwaUnvp59hCe7l3LLnLLIQHzYYlngkc4SVbGYsguMRAPECwPkBGj2/s+op5KStUspG7LEtaiEA3VhSpAYqYYlklRYaRnu7yGsaDUvuQ0k4/ab/shNbYu1E/nBH7tEfPu6s8a/Ym2aWVRzKebOP5YMsIQvdAQlCd4hibE2y11hdOp9liWpSampWsDdlswUeBUUMBEccuMpWnt+isoXFUzUbO21MptiS5iESlkTV2mywtN5qhkcjz6xjNr7VXVTTNmolpOEJKZYwoDEthS+7z531jTU20aD+jZdDOqiFBRUpSJalAKxqVhSohlAOA9wYS1tNs1MtapVVOmrCThQUhIJ4E4fHwhMMlGTtO7fhhnBtKvQ97Cqk09JWVtQZiUTB91QqUBjZQeapGKz+zfTCYb/AGdVGzO8nUdOqrP3mWQoT0ysIwpN0lFwpietuUZLtDtGUaakpJC8aJWJUwpyMz8RD5hypjwMCbIre4nyJ2RlzEqPR9/rulVoLxyyQk9+a/ToRtQaRq+yNCpFNtiib8uA3NQCJgDdSP8AuI+fpk5g/wAxpG17R9pZKa0V1HNSskBM6WygVMbKDpGIWBcXBSDzAu0k7Pqj3qaj7ss3UFJcPqcNjxNrHxeFxZHF8pJ1KvHTKSx8lSe0dsrYFJN2XV1KpShOkYgkiYrCThQQcHEYuLPppDH7TE/1XZY1FOQf+FKYoG0KOl2fU0iKz7wucCQUy1JAUQgAEmzMnN9cotmdpaaupESKpXcrlhGFYGqU4cQfiHdJ48QDCc5c+e6Uvz1X9h4WuPmgT7Ianu9oFX+ksea5MLexM4S9qSFnRc79iZBuwq2ipVLwTitak70xQISAFJIQgAPfM6MmFOzZ0mVWCYqcnu0YlJUlyV40qYNmkh7vkRq4ijfJzdPa1+5lClFP3sZdru086bMqZBlSO7ExQxIlJTMLKcHGLklr8XPGB9nbLpShJWxBQlWPvPaV3S1zUlCSCnAsBLve35wEU7R+5zJq5gqVjGoqICQGe9nF4Urp5a5mCQlS+ZZRWXLqYABIyz4Z3aGgk41G17BJNO3TLqIoK1MQmWVte2ELCkgknIWBJj0yFSu8lTE4VoICgeIsW5ZEHUMYNk9mJyi4whwzFStf9qCOGsTq6EyimXUsoFLIWlYKgEsAlwuyQ4DLTww2EVWSN6dknjk1vR5SKSQnLP49fCAZhuWPFs+NotmiWiWruwXBTvEgk7zMCLAW0zigK5NDxlybITjxGBWlRKmKg/4rf8mJv4nxgaqLl+P0/KPKecEviQFBxqoEcSGLeBfKLloBLhkgZWzOjML+MNWxGCPBEu3Q2Pv+EUzkEFomFfP+EMAKk5DxhgioZj5gwsp4JxaQRGOSqNH2KkhMqZdyqapRJ4lKPIAMPCMRtSvTLQ6ndrAEpJP+4ZDj/GNF9layqlmk5merNz/dytSXgzYMEG9nz2TnB0pOnFoH7m56wZQEKVyBHlb+MSqisnZBdPxAI+uMCzZDQ/rZKUqsoENpfUtyyaAp8oM4+ukUTJRkLEp5QQlATlnqYkqbdzply59YjMLAkxqKdi+uWCqxJ5/LlA5iSySSTHjQpQ9p1YVoVwUk+REH9oZbTUq1II4Myi3Q4SIEMoMel/4QymflpUtZNwUk9Uslb9U4SOQiUn9yZSO1Rt/tTlNRyTm833oePna5YbR+f8Y+o/bAR9wpWz70P/8AWf4x8qTMd3iHwneL9WU+S/vNXsHs1RVMgziuajuh+WwhBAYE4kgSySCAS1yMrxKj2HsVS0pNbN3iB7DZlhcyLdYY/Zps+ZOoa1EtnO6HLByiYBfQRle0HY+poUCZPCAFLwjCoqLspR0AYAeohFLlklDnTvS0U6gnQFsnYs2pm9zKQCoXUTYIFgST14XOkaabsTZlGcNTPM6aPaTLBCUnhukE/wDLwEOuz0k0mx5tUA0yac9WfAgcWYKPVUfOky8QKlXUbk6w8ZSzSaTpLWvLFfHGk2rbNBtKgoFU86fSqXjRgZBJs8xCXLkki514R52V7Py6wKGKalaGcJwkEKdiHFsiG5RnkyVWZEx1ZMg7zlgzZ3bxj6D9j6CqZUYE4rSSBYfimgZ2gZ3LFibUthg4zmrWjOK2Zsss1cvK7yTb/pfTzj3YfZ2TPrJtM604e8KVDAXCFAbwKRnm9ukS2x2Fq6SR3tR3SUhSEABRUpSjwYMAAFEl9IM+y1JO0L/4U3/xAnJrFKcZ3r8f0aLTkotUUdquyf3NYKXVKUwCiLhQG8lXA5kZOOimr7K9mkVkyaglSSlIUCnDd1JSxxA8Xjddn9rSqydV7OqWKhMnJluWxoStTBJ0mIzHEB9C9fYTs/Npdoz5C3/sSqWtrLR3koAjm5YjTm4JnL5M1hknqSV/7XsKxx+omujAbF7PyqmfPkpxp7sKUFHu3whSUbwwgZqGWT+MWL7P0SZhlrq8C0kggy8iHsdz1ht9micW1ahPGVNH/wCkswn7Uy/6/VAj+9WDyIUR9eMVucsrgpNaTBcIwtq9nm1uzMyTLE0FEyWQCFpyuWD3OtnBz4Zw52JR/d9nrqUICpiklb6NiZIPIDeI6wf9l8j7z94olkmVgUrDzUAhuWaVdUiKPs729JwGjq1hAJ3Fq9kOADLVokWcHK6nOUSyzyOLi98Wr/KKY+Cla8r/AIzMyu0tWm+O3Bh9eETru0QmmSuahKjL7wKAGHFiCWJawNjl/E63tV9msxClKpd9B3gnl/lvvdPUC0fPF7LmCZ3S0lF94kEMkDESfByOL2cF4vi+jP7oEpTyrUgqoKe6JFgoobxJmXawJBForli3ugmt9pKODrI4PZIPMJDeURUgD5R0YurOfK90VtxgickpOhtoQbciIqURzjyWp84oSO6R5cNFveP0+s4gtXl9fXjGAWSFXI0gguxbPRz7yIEBZjBcsuAfrMiCI+yn7konEs41LYEswlpDuznM5Dxje/Z7JSmRNSnScXvqZco28CB4RkZSrRsuwgHczG/xST1wS4M1oOGTcqPmSa0EFhdWY8cuY+UV09SQXHll/KFoJi1BiTL8UaGVUuA+fDOK6mpIsIXU68N+It7/AIROZMgWLwRJRfMxXMSTqWzi6XKs8VTxDqQK2DNEgImERJCYzCmeAO44W8wDBNBMwLwH2VkNyVl6gt5RVs1GNSr/ACbSLZsshcuznGkhg+RBOWYABiU0noeLpm8+1ee9JKT+bOUB4JUGj5gZlo+iduqebPSUSgFYahamKkjVY/EQ4sB4xjKjs7UZ92mWNfysthzbE4Ec3xJRhj4t+WdGeLlK0aTsbW4dm10v/ESf2Fj/ANRiwGxB/CzOMrefnDzYm25MhGAypiwRvey1wxAB0ZhzYmzsDZO26EZ0BP6iPnBi3Ccnxbt/gzSlFK6N3sGqlVOyUU5IBKFJc5JUN1JPJsCz/uj5LUy1SlKlrBSpJYgs4bN4b/06mXP72lQuWlXtyVAYbBnSQbAjRrc9Ca/a9LUsqdJUFsBbELDIOnhoC8Li5YpN1p7/ACmGcVNJXtGj+y+vw01QkksSoJvYbmj5FyTbPXSFP2WVOFNUnSYiUg9D3r21084W022JMlGCSiZhK0qV7RyZ2LZsG06wDsPbP3VDCWsrJBUchu+yAG5qLnjlaEljlNTpd1+w0Wk434sX0SUgAuxIDhwHyNx1vGo+zyuEuvxuGEuZ64ITTNq09j9zAB1ex9I6m2siXOVMElQBTgloSAnddypTXUom/pe0dGW545R49r8EoR4zTshtmeoVs+bLUUqE+YtKhYg4ypJB4x9U7MduhPSiZMSBNSMK8JbMpJUnkopSW0II4P8AJKsrmTFzEBkrJLLBB9xiWypkyTMxHLUB8tdIlm+PHLjS8pDY8jjJ+maPsFU93tOfMdmlzPVaB8YVdrJp+/VCtVTFnPN1qiexdrpp506aJalleJIazJxpU7m7nCmzBt7jBczb1KtZmTKMqWouVbpcsLs4D2zjXKOXkot6SGcVKFX5GXYStXRyKiuIDKSEIBLYsyVD9YS0jjvcHjEpDJD58Yb9oNpTKgMkYJackuokcyQkB25ADnGg212dl1IE6QEyitMteAHdOOWhYAAfAQ5GFiC1sGUGE1jbnk1y/b0hZQ5JRh4E3ZjtvU0RCUrxSv8ADW5T+qCdw9P4Rpu2W0pdRKl1aUspJTiv7aSsJUlR1OJi7XZ9b5CV2Xng4cAGilqUnLwJbwDwx7SzkSpCKRBxKZOLkAcTkaFSrtwB5Qk1CWSLh35r0FNqL5CanmFalLVmoufHQdMvCLljrAlBYwYu8eilSo4m7ZU0dHpikL3oICWrRYA9oHSreeCRBFZ5LGg6xdKmRUk6iPUwRWEypkbrsAXkTf0x/dyo+evG++zg/wBXm/pj+7lRpPQcS+4+RPcxMRWpIjkpbWJs6AqUrMk6cYtlQKCIIlkm8K0YKEwx4hLmPZct4YUlKG1vzaEbo1WUClJ0YRXV0oSgkH09HMMphsw9D9CElXOCjqW1Kn8mAHlGUmDie7LtMAYXtfz+Y8YYzaxdOvvEBOO+EkE4bWUkOGIO8CXuE8C6YG4+vQ2gtSsQ6QzezbRKXt+oAYKDf7E/OIz66onjApTjOyQPdFaEh4sQSCCMxCcIJ2kN9SXsJp9mrZsSh4n3QBVLWFEJWpgW8s/WHMjaCQk4lK5BNvrpCefMxEnLgOA4fXOMlb2gJv2VmomjKYfT5RA7Rnf4h8k/KK5/F4qBhuC9Dcn7CRtWcMph8k/KOG1Z7v3h8Qk/CB5jPbKPEakweEfRuT9jWlrRMscKF5ks6VAXJKTbEBcHlwcQONqqST3RwD84jEo8yVPC+OeB9NB5sZ/0tUF/yxY52S3k0RRtCeS3eG2WXygVGXCPULv/ABhvpx9IXnL2GGsnf4qvBvlFf3mc/wDaK9PlHJPCPYPCPoXnL2ca6eMpqh5fKOo9r1Er+znLSMmxW4eybZcoqUY8aA8cXqhlkkvIxPaCsWCDNU2pSlCfNSUv6wDJDuS7nX43LvHkssXiYzyz0gRhGPSoEpyl2WyyxtBUiY453eBlAtly/lHtMbxRE2ErUPSAUm8TmLufKK09I1mJAwWlUCNFqVwRT2mW4UXtiLRa8BU5zi/FGQGtluKPoH2bH+rzf0x/dyo+bKmtH0X7LlvTTT/rq/dyoDY+NbPlChHovHsdAKM9MTlkavHR0ZgGchRAtl4QypVJ/ESQOXozh/GOjok9hTIbaqZITZKpmTnEyb/hURrY2u0Z8rBJIAAJsBpycx7HQUqQx4VXi+Uu8dHQQeC9aYiAY8joNCWVTlD60itamEdHQQgqi8eER0dGCReOjo6CY9EcDHR0YJNJe5/lHqDeOjowC9CyTE1GOjoIr7IR6I9jowDwR6mOjowQia2Qbw+HKIR7HQEBkRHoj2OggOERXHR0EBFBvFxjo6MjMFmp4k+kfS/sp/8AizP06v3cqOjoDKRP/9k=',
    date: '2024-01-11',
    views: 15678,
    comments: 654,
    category: '电竞资讯',
    tags: ['英雄联盟', 'MOBA', '电竞'],
    author: {
      name: '电竞解说小刘',
      avatar: 'https://picsum.photos/id/5/32/32'
    }
  },
  {
    id: 7,
    title: '《黑神话：悟空》官方公布新实机演示，战斗系统详解',
    summary: '游戏科学今日公布了《黑神话：悟空》的全新实机演示，详细展示了游戏的战斗系统和各种技能。从演示中可以看出，游戏的战斗系统非常丰富，玩家可以使用金箍棒的多种形态进行战斗，还能变身为各种动物。',
    cover: 'https://heyboxbj.max-c.com/gameimg/steam_item_assets/7cfcf0560343bc0e5db5e78163ae702b.jpg',
    date: '2024-01-09',
    views: 56789,
    comments: 2345,
    category: '国产游戏',
    tags: ['黑神话：悟空', '游戏科学', '动作游戏'],
    author: {
      name: '国产游戏支持者小陈',
      avatar: 'https://picsum.photos/id/7/32/32'
    }
  },
  {
    id: 8,
    title: '《龙之信条2》正式公布，2024年夏季发售',
    summary: '卡普空今日正式公布了《龙之信条2》，这款备受期待的动作RPG游戏将于2024年夏季在各大平台发售。游戏将采用全新的游戏引擎，提供更加广阔的开放世界和更加流畅的战斗体验。',
    cover: 'https://imgheybox.max-c.com/heybox/game/header/2054970_QclTU.jpg',
    date: '2024-01-08',
    views: 18901,
    comments: 789,
    category: '游戏公布',
    tags: ['龙之信条2', '卡普空', '动作RPG'],
    author: {
      name: '动作游戏爱好者小张',
      avatar: 'https://picsum.photos/id/8/32/32'
    }
  }
  ];

export { mockNewsData };

const NewsPage = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    // 模拟API请求
    const fetchNews = async () => {
      setLoading(true);
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNewsData(mockNewsData);
      setLoading(false);
    };

    fetchNews();
  }, []);

  // 计算当前页显示的数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentNews = newsData.slice(startIndex, endIndex);

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // 格式化阅读量
  const formatViews = (views) => {
    if (views >= 10000) {
      return (views / 10000).toFixed(1) + '万';
    }
    return views.toString();
  };

  return (
    <div className="news-page">
      <div className="page-header">
        <Title level={2} className="page-title">
          <Badge color="red" text="热门" className="hot-badge" />
          游戏资讯
        </Title>
        <Paragraph className="page-description">
          最新、最热门的游戏行业动态，一手掌握
        </Paragraph>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]} className="news-grid">
            {currentNews.map((news) => (
              <Col xs={24} sm={12} lg={8} key={news.id}>
                <Card
                  hoverable
                  cover={
                    <div className="news-cover-container">
                      <div className="no-image-placeholder">
                        <img src={news.cover} alt={news.title} />
                      </div>
                      <Tag color="blue" className="news-category">
                        {news.category}
                      </Tag>
                    </div>
                  }
                  className="news-card"
                  onClick={() => navigate(`/news/${news.id}`)}
                >
                  <Title level={4} className="news-title">
                    {news.title}
                  </Title>
                  <Paragraph ellipsis={{ rows: 3 }} className="news-summary">
                    {news.summary}
                  </Paragraph>
                  
                  <div className="news-meta">
                    <div className="author-info">
                      <Avatar size={24} src={news.author.avatar} />
                      <Text className="author-name">{news.author.name}</Text>
                    </div>
                    <div className="news-stats">
                      <span className="stat-item">
                        <CalendarOutlined className="stat-icon" />
                        <Text type="secondary">{news.date}</Text>
                      </span>
                      <span className="stat-item">
                        <EyeOutlined className="stat-icon" />
                        <Text type="secondary">{formatViews(news.views)}</Text>
                      </span>
                      <span className="stat-item">
                        <MessageOutlined className="stat-icon" />
                        <Text type="secondary">{news.comments}</Text>
                      </span>
                    </div>
                  </div>

                  <div className="news-tags">
                    {news.tags.map((tag, index) => (
                      <Tag key={index} className="news-tag">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={newsData.length}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条资讯`}
              pageSizeOptions={['6', '12', '24']}
              className="news-pagination"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NewsPage;