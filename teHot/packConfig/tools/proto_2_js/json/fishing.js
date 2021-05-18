module.exports = {
  "nested": {
    "fishprotos": {
      "nested": {
        "Blank": {
          "fields": {}
        },
        "RespComm": {
          "fields": {
            "errcode": {
              "type": "int32",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            }
          }
        },
        "Broadcast": {
          "fields": {
            "msgid": {
              "type": "int32",
              "id": 1
            },
            "body": {
              "keyType": "string",
              "type": "bytes",
              "id": 2
            }
          }
        },
        "ReqHeartbeat": {
          "fields": {
            "timestamp": {
              "type": "int64",
              "id": 1
            }
          }
        },
        "RespHeartbeat": {
          "fields": {
            "errcode": {
              "type": "int32",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            },
            "timestamp": {
              "type": "int64",
              "id": 3
            }
          }
        },
        "ReqAuthorize": {
          "fields": {
            "uid": {
              "type": "int64",
              "id": 1
            },
            "timestamp": {
              "type": "int64",
              "id": 2
            },
            "nonce": {
              "type": "string",
              "id": 3
            },
            "sign": {
              "type": "string",
              "id": 4
            }
          }
        },
        "RespAuthorize": {
          "fields": {
            "errcode": {
              "type": "int32",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            }
          }
        },
        "ReqMatchRegister": {
          "fields": {
            "uid": {
              "type": "int64",
              "id": 1
            },
            "ver": {
              "type": "string",
              "id": 2
            },
            "appid": {
              "type": "int32",
              "id": 3
            },
            "channelid": {
              "type": "int32",
              "id": 4
            },
            "deviceCode": {
              "type": "string",
              "id": 5
            },
            "region": {
              "type": "string",
              "id": 6
            },
            "props": {
              "rule": "repeated",
              "type": "int32",
              "id": 7
            },
            "gameInfoField": {
              "rule": "repeated",
              "type": "string",
              "id": 8
            },
            "registerType": {
              "type": "int32",
              "id": 9
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "RespMatchRegister": {
          "fields": {
            "errcode": {
              "type": "int32",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            },
            "uid": {
              "type": "int64",
              "id": 3
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "ReqMatchUnregister": {
          "fields": {
            "uid": {
              "type": "int64",
              "id": 1
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "RespMatchUnregister": {
          "fields": {
            "errcode": {
              "type": "int32",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            },
            "uid": {
              "type": "int64",
              "id": 3
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "ReqJoinMatch": {
          "fields": {
            "uid": {
              "type": "int64",
              "id": 1
            },
            "fields": {
              "rule": "repeated",
              "type": "string",
              "id": 2
            },
            "props": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            },
            "seniorProp": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 20
            }
          }
        },
        "RespJoinMatch": {
          "fields": {
            "errcode": {
              "type": "int32",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            },
            "uid": {
              "type": "int64",
              "id": 3
            },
            "infos": {
              "keyType": "string",
              "type": "string",
              "id": 4
            },
            "props": {
              "keyType": "int32",
              "type": "int64",
              "id": 5
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "ReqLeaveMatch": {
          "fields": {
            "uid": {
              "type": "int64",
              "id": 1
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "RespLeaveMatch": {
          "fields": {
            "errcode": {
              "type": "int32",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            },
            "uid": {
              "type": "int64",
              "id": 3
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "NotifyMatchReady": {
          "fields": {
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "NotifyPreEnlistPlayerChange": {
          "fields": {
            "nNowPlayerCount": {
              "type": "int32",
              "id": 1
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "ReqRegisterCount": {
          "fields": {
            "uid": {
              "type": "int64",
              "id": 1
            }
          }
        },
        "RespRewardMatchInfo": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "nLeftBulletCount": {
              "type": "int32",
              "id": 2
            },
            "nCurScore": {
              "type": "int32",
              "id": 3
            },
            "nMaxScore": {
              "type": "int32",
              "id": 4
            },
            "nMaxAddScore": {
              "type": "int32",
              "id": 5
            },
            "nRank": {
              "type": "int32",
              "id": 6
            },
            "taskInfo": {
              "type": "tagMatchTaskInfo",
              "id": 7
            }
          }
        },
        "ReqRewardMatchRestart": {
          "fields": {}
        },
        "RespRewardMatchEnd": {
          "fields": {
            "nTotalScore": {
              "type": "int32",
              "id": 1
            },
            "nNorAddScore": {
              "type": "int32",
              "id": 2
            },
            "nVipAddScore": {
              "type": "int32",
              "id": 3
            },
            "nMaxScore": {
              "type": "int32",
              "id": 4
            },
            "nRank": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "NotifyRewardMatchScoreChange": {
          "fields": {
            "nBaseScore": {
              "type": "int32",
              "id": 1
            },
            "nNorAddScore": {
              "type": "int32",
              "id": 2
            },
            "nVipAddScore": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "RespRewardMatchNewTask": {
          "fields": {
            "newTaskInfo": {
              "type": "tagMatchTaskInfo",
              "id": 1
            }
          }
        },
        "NotifyRewardMatchTaskData": {
          "fields": {
            "taskInfo": {
              "type": "tagMatchTaskInfo",
              "id": 1
            }
          }
        },
        "RespRewardMatchTaskReward": {
          "fields": {
            "nAddScore": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RespRewardMatchTaskFail": {
          "fields": {
            "nReason": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "ReqRewardMatchGiveUp": {
          "fields": {}
        },
        "ReqJoinGame": {
          "fields": {
            "uid": {
              "type": "int64",
              "id": 1
            },
            "ver": {
              "type": "string",
              "id": 2
            },
            "appid": {
              "type": "int32",
              "id": 3
            },
            "channelid": {
              "type": "int32",
              "id": 4
            },
            "deviceCode": {
              "type": "string",
              "id": 5
            },
            "region": {
              "type": "string",
              "id": 6
            },
            "fields": {
              "rule": "repeated",
              "type": "string",
              "id": 10
            },
            "props": {
              "rule": "repeated",
              "type": "int32",
              "id": 11
            },
            "seniorProp": {
              "rule": "repeated",
              "type": "int32",
              "id": 12
            },
            "toSitDesk": {
              "type": "int32",
              "id": 13
            },
            "toChairId": {
              "type": "int32",
              "id": 14
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 20
            }
          }
        },
        "RespJoinGame": {
          "fields": {
            "errcode": {
              "type": "int32",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            },
            "uid": {
              "type": "int64",
              "id": 3
            },
            "infos": {
              "keyType": "string",
              "type": "string",
              "id": 4
            },
            "props": {
              "keyType": "int32",
              "type": "int64",
              "id": 5
            },
            "nDeskId": {
              "type": "int32",
              "id": 6
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "ReqLeaveGame": {
          "fields": {
            "uid": {
              "type": "int64",
              "id": 1
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "RespLeaveGame": {
          "fields": {
            "errcode": {
              "type": "int32",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            },
            "uid": {
              "type": "int64",
              "id": 3
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "NotifyKickOff": {
          "fields": {
            "uid": {
              "type": "int64",
              "id": 1
            },
            "msg": {
              "type": "string",
              "id": 2
            },
            "ext": {
              "keyType": "string",
              "type": "bytes",
              "id": 10
            }
          }
        },
        "NotifyOtherLogin": {
          "fields": {}
        },
        "ReqMSGC2SGameStatus": {
          "fields": {}
        },
        "RespMSGS2CGameStatus": {
          "fields": {
            "dwServerTime": {
              "type": "int64",
              "id": 1
            },
            "nOnLineRewardCount": {
              "type": "int32",
              "id": 2
            },
            "nMapId": {
              "type": "int32",
              "id": 3
            },
            "nClientRequireRandom": {
              "type": "int32",
              "id": 4
            },
            "vecTimeline": {
              "rule": "repeated",
              "type": "tagTimeLineInfo",
              "id": 5
            },
            "vecPlayerInfo": {
              "rule": "repeated",
              "type": "tagPlayerInfo",
              "id": 6
            }
          }
        },
        "ReqMSGC2SPlayerShoot": {
          "fields": {
            "strBulletId": {
              "type": "string",
              "id": 1
            },
            "strAngle": {
              "type": "string",
              "id": 2
            },
            "nGunRate": {
              "type": "int32",
              "id": 3
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 4
            },
            "nPointX": {
              "type": "int32",
              "id": 5
            },
            "nPointY": {
              "type": "int32",
              "id": 6
            },
            "nEffectType": {
              "type": "int32",
              "id": 7
            },
            "nFrameCount": {
              "type": "int32",
              "id": 8
            },
            "nViolentRate": {
              "type": "int32",
              "id": 9
            },
            "dwGunId": {
              "type": "int32",
              "id": 10
            },
            "nSpecialFishId": {
              "type": "int32",
              "id": 11
            },
            "nSpecialFishType": {
              "type": "int32",
              "id": 12
            },
            "nBulletType": {
              "type": "int32",
              "id": 13
            }
          }
        },
        "RespMSGS2CPlayerShoot": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            },
            "strBulletId": {
              "type": "string",
              "id": 4
            },
            "strAngle": {
              "type": "string",
              "id": 5
            },
            "nGunRate": {
              "type": "int32",
              "id": 6
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 7
            },
            "nPointX": {
              "type": "int32",
              "id": 8
            },
            "nPointY": {
              "type": "int32",
              "id": 9
            },
            "nEffectType": {
              "type": "int32",
              "id": 10
            },
            "nViolentRatio": {
              "type": "int32",
              "id": 11
            },
            "nFrameCount": {
              "type": "int32",
              "id": 12
            },
            "bValidate": {
              "type": "bool",
              "id": 13
            },
            "nMoneyCost": {
              "type": "int64",
              "id": 14
            },
            "nNewFishIcon": {
              "type": "int64",
              "id": 15
            },
            "nMasterLeftBullet": {
              "type": "int32",
              "id": 16
            },
            "nIsAutoHit": {
              "type": "int32",
              "id": 17
            },
            "dwGunId": {
              "type": "int32",
              "id": 18
            },
            "nSpecialFishId": {
              "type": "int32",
              "id": 19
            },
            "nSpecialFishType": {
              "type": "int32",
              "id": 20
            },
            "nBulletType": {
              "type": "int32",
              "id": 21
            }
          }
        },
        "ReqMSGC2SPlayerHit": {
          "fields": {
            "strBulletId": {
              "type": "string",
              "id": 1
            },
            "nFrameId": {
              "type": "int32",
              "id": 2
            },
            "vecHitFishes": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            },
            "vecEffectedFishes": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            },
            "nSpecialFishId": {
              "type": "int32",
              "id": 5
            },
            "nSpecialFishType": {
              "type": "int32",
              "id": 6
            }
          }
        },
        "RespMSGS2CPlayerHit": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            },
            "dwNewFishCoin": {
              "type": "int64",
              "id": 4
            },
            "strBulletId": {
              "type": "string",
              "id": 5
            },
            "vecKilledFishes": {
              "rule": "repeated",
              "type": "tagKillFishInfo",
              "id": 7
            },
            "nGunRate": {
              "type": "int32",
              "id": 8
            },
            "vecDropProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 9
            },
            "nNewCrystal": {
              "type": "int32",
              "id": 11
            },
            "vecDropSeniorProps": {
              "rule": "repeated",
              "type": "tagSeniorProps",
              "id": 13
            },
            "nKillFishScore": {
              "type": "int64",
              "id": 15
            },
            "bIsViolent": {
              "type": "bool",
              "id": 17
            },
            "vecHitFishes": {
              "rule": "repeated",
              "type": "int32",
              "id": 21
            },
            "nSpecialFishId": {
              "type": "int32",
              "id": 22
            },
            "nSpecialFishType": {
              "type": "int32",
              "id": 23
            }
          }
        },
        "ReqMSGC2SGunRateChange": {
          "fields": {
            "nNewGunRate": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RespMSGS2CGunRateChange": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            },
            "nNewGunRate": {
              "type": "int32",
              "id": 4
            }
          }
        },
        "ReqMSGC2SBulletTargetChange": {
          "fields": {
            "vecStrBulletIds": {
              "rule": "repeated",
              "type": "string",
              "id": 1
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "RespMSGS2CBulletTargetChange": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            },
            "vecStrBulletIds": {
              "rule": "repeated",
              "type": "string",
              "id": 4
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "ReqMSGC2SAim": {
          "fields": {
            "dwTimelineId": {
              "type": "int32",
              "id": 1
            },
            "nUseType": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "RespMSGS2CAimResult": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "nPlayerId": {
              "type": "int32",
              "id": 2
            },
            "nUseType": {
              "type": "int32",
              "id": 3
            },
            "nNewCrystal": {
              "type": "int32",
              "id": 4
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "ReqMSGC2SCallFish": {
          "fields": {
            "dwCallFishId": {
              "type": "int32",
              "id": 1
            },
            "nUseType": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "RespMSGS2CCallFish": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 2
            },
            "nUseType": {
              "type": "int32",
              "id": 3
            },
            "nNewCrystal": {
              "type": "int32",
              "id": 4
            },
            "timeLineInfo": {
              "type": "tagTimeLineInfo",
              "id": 5
            }
          }
        },
        "ReqMSGC2SNBomb": {
          "fields": {
            "nPointX": {
              "type": "int32",
              "id": 1
            },
            "nPointY": {
              "type": "int32",
              "id": 2
            },
            "dwNBombId": {
              "type": "int32",
              "id": 3
            },
            "nCount": {
              "type": "int32",
              "id": 4
            }
          }
        },
        "RespMSGS2CNBomb": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 2
            },
            "dwNBombId": {
              "type": "int32",
              "id": 3
            },
            "nCount": {
              "type": "int32",
              "id": 4
            },
            "nPointX": {
              "type": "int32",
              "id": 5
            },
            "nPointY": {
              "type": "int32",
              "id": 6
            }
          }
        },
        "ReqMSGC2SNBombBlast": {
          "fields": {
            "dwBombId": {
              "type": "int32",
              "id": 1
            },
            "nCount": {
              "type": "int32",
              "id": 2
            },
            "vecKilledFishes": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            }
          }
        },
        "RespMSGS2CNBombBlast": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 2
            },
            "nGunRate": {
              "type": "int32",
              "id": 3
            },
            "nMoneyChange": {
              "type": "int64",
              "id": 4
            },
            "nNewFishIcon": {
              "type": "int64",
              "id": 5
            },
            "dwBombId": {
              "type": "int32",
              "id": 6
            },
            "nNewCount": {
              "type": "int64",
              "id": 7
            },
            "vecKilledFishes": {
              "rule": "repeated",
              "type": "tagKillFishInfo",
              "id": 8
            }
          }
        },
        "ReqMSGC2SGetPlayerInfo": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RespMSGS2CGetPlayerInfo": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "tPlayerInfo": {
              "type": "tagPlayerInfo",
              "id": 2
            }
          }
        },
        "ReqMSGC2SViolent": {
          "fields": {
            "nUseType": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "RespMSGS2CViolent": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 2
            },
            "nUseType": {
              "type": "int32",
              "id": 3
            },
            "nNewCrystal": {
              "type": "int32",
              "id": 4
            }
          }
        },
        "ReqMSGC2SGetNewTaskInfo": {
          "fields": {}
        },
        "RespMSGS2CGetNewTaskInfo": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "bIsSuccess": {
              "type": "bool",
              "id": 3
            },
            "nTaskId": {
              "type": "int32",
              "id": 4
            },
            "nTaskData": {
              "type": "int32",
              "id": 5
            },
            "bFinishAllTask": {
              "type": "bool",
              "id": 6
            }
          }
        },
        "ReqMSGC2SArenaReady": {
          "fields": {}
        },
        "RespMSGS2CArenaReady": {
          "fields": {
            "bStarted": {
              "type": "bool",
              "id": 1
            },
            "nLeftStartSecond": {
              "type": "int32",
              "id": 2
            },
            "nFrameId": {
              "type": "int32",
              "id": 3
            },
            "nTimelineIndex": {
              "type": "int32",
              "id": 4
            },
            "vecBullets": {
              "rule": "repeated",
              "type": "tagBulletInfo",
              "id": 5
            },
            "vecKilledFishes": {
              "rule": "repeated",
              "type": "int32",
              "id": 6
            },
            "vecPlayerInfo": {
              "rule": "repeated",
              "type": "tagArenaFreePlayerInfo",
              "id": 7
            },
            "vecCalledFishes": {
              "rule": "repeated",
              "type": "tagCalledFishInfo",
              "id": 8
            },
            "nLeftSecond": {
              "type": "int32",
              "id": 9
            },
            "nInitBulletCount": {
              "type": "int32",
              "id": 10
            },
            "nserverTime": {
              "type": "int32",
              "id": 11
            },
            "vecRankPlayers": {
              "rule": "repeated",
              "type": "tagArenaRankPlayerItem",
              "id": 12
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 13
            },
            "nArenaType": {
              "type": "int32",
              "id": 14
            },
            "vecShareSwitchs": {
              "rule": "repeated",
              "type": "int32",
              "id": 15
            },
            "vecShareInfo": {
              "rule": "repeated",
              "type": "tagCommonShareItem",
              "id": 16
            }
          }
        },
        "ReqMSGC2SBatchShoot": {
          "fields": {
            "vecBullets": {
              "rule": "repeated",
              "type": "tagBatchBulletInfo",
              "id": 1
            },
            "bIsViolent": {
              "type": "bool",
              "id": 8
            },
            "nFrameCount": {
              "type": "int32",
              "id": 9
            },
            "nViolentRate": {
              "type": "int32",
              "id": 10
            },
            "nGunRate": {
              "type": "int32",
              "id": 11
            }
          }
        },
        "RespMSGS2CBatchShoot": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "vecBullets": {
              "rule": "repeated",
              "type": "tagBatchBulletInfo",
              "id": 2
            },
            "nGunRate": {
              "type": "int32",
              "id": 4
            },
            "bIsViolent": {
              "type": "bool",
              "id": 9
            },
            "nViolentRate": {
              "type": "int32",
              "id": 10
            },
            "nFrameCount": {
              "type": "int32",
              "id": 11
            },
            "nMoneyCost": {
              "type": "int64",
              "id": 13
            },
            "nNewFishCoin": {
              "type": "int64",
              "id": 14
            },
            "nMasterLeftBullet": {
              "type": "int32",
              "id": 15
            }
          }
        },
        "ReqMSGC2SGetNewTaskReward": {
          "fields": {
            "nTaskId": {
              "type": "int32",
              "id": 1
            },
            "nShareType": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "RespMSGS2CGetNewTaskReward": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "bIsSuccess": {
              "type": "bool",
              "id": 3
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 4
            },
            "vecSeniorProp": {
              "rule": "repeated",
              "type": "tagSeniorProps",
              "id": 5
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 6
            }
          }
        },
        "ReqMSGC2SOnlineRewardInfo": {
          "fields": {}
        },
        "RespMSGS2COnlineRewardInfo": {
          "fields": {
            "nErrorCode": {
              "type": "int32",
              "id": 1
            },
            "nHadRewardCount": {
              "type": "int32",
              "id": 2
            },
            "nLeftTime": {
              "type": "int64",
              "id": 3
            }
          }
        },
        "ReqMSGC2SGetOnlineReward": {
          "fields": {}
        },
        "RespMSGS2CGetOnlineReward": {
          "fields": {
            "nErrorCode": {
              "type": "int32",
              "id": 1
            },
            "nPlayerId": {
              "type": "int32",
              "id": 2
            },
            "nHadRewardCount": {
              "type": "int32",
              "id": 3
            },
            "nNextLeftTime": {
              "type": "int64",
              "id": 4
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 5
            },
            "vecSeniorProps": {
              "rule": "repeated",
              "type": "tagSeniorProps",
              "id": 6
            }
          }
        },
        "ReqMSGC2SEmoticon": {
          "fields": {
            "dwEmoticonId": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RespMSGS2CEmoticon": {
          "fields": {
            "nErrorCode": {
              "type": "int32",
              "id": 1
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 2
            },
            "dwEmoticonId": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "ReqMSGC2SGhostPlayerShoot": {
          "fields": {
            "strBulletId": {
              "type": "string",
              "id": 1
            },
            "strAngle": {
              "type": "string",
              "id": 2
            },
            "nGunRate": {
              "type": "int32",
              "id": 3
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 4
            },
            "nPointX": {
              "type": "int32",
              "id": 5
            },
            "nPointY": {
              "type": "int32",
              "id": 6
            },
            "nFrameCount": {
              "type": "int32",
              "id": 7
            }
          }
        },
        "RespMSGS2CGhostPlayerShoot": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            },
            "strBulletId": {
              "type": "string",
              "id": 4
            },
            "strAngle": {
              "type": "string",
              "id": 5
            },
            "nGunRate": {
              "type": "int32",
              "id": 6
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 7
            },
            "nPointX": {
              "type": "int32",
              "id": 8
            },
            "nPointY": {
              "type": "int32",
              "id": 9
            },
            "tConsumeProp": {
              "type": "tagProp",
              "id": 10
            },
            "tSurplusProp": {
              "type": "tagProp",
              "id": 11
            },
            "nFrameCount": {
              "type": "int32",
              "id": 12
            },
            "bValidate": {
              "type": "bool",
              "id": 13
            }
          }
        },
        "ReqMSGC2SGhostPlayerHit": {
          "fields": {
            "strBulletId": {
              "type": "string",
              "id": 1
            },
            "nFrameId": {
              "type": "int32",
              "id": 2
            },
            "vecHitFishes": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            },
            "vecEffectedFishes": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            }
          }
        },
        "RespMSGS2CGhostPlayerHit": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            },
            "dwHappyCoin": {
              "type": "int32",
              "id": 4
            },
            "strBulletId": {
              "type": "string",
              "id": 5
            },
            "dwFrameId": {
              "type": "int32",
              "id": 6
            },
            "vecKilledFishes": {
              "rule": "repeated",
              "type": "int32",
              "id": 7
            },
            "nGunRate": {
              "type": "int32",
              "id": 8
            },
            "vecDropProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 9
            },
            "vecGhostLegion": {
              "rule": "repeated",
              "type": "tagGhostLegion",
              "id": 10
            },
            "nMoneyChange": {
              "type": "int64",
              "id": 11
            },
            "nFirstGetCoin": {
              "type": "int64",
              "id": 12
            }
          }
        },
        "ReqMSGC2SGetPlayerMatchState": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RespMSGC2SGetPlayerMatchState": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nState": {
              "type": "int32",
              "id": 2
            },
            "nRoomId": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "ReqMSGC2SPowerChange": {
          "fields": {
            "nNewPower": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RespMSGS2CPowerChange": {
          "fields": {
            "bIsSuccess": {
              "type": "bool",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            },
            "nNewPower": {
              "type": "int32",
              "id": 4
            }
          }
        },
        "ReqMSGC2SPartFreezeStart": {
          "fields": {
            "nUseType": {
              "type": "int32",
              "id": 1
            },
            "VecTimeLineId": {
              "rule": "repeated",
              "type": "int32",
              "id": 2
            }
          }
        },
        "RespMSGS2CPartFreezeStart": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nNewCrystal": {
              "type": "int32",
              "id": 2
            },
            "nUseType": {
              "type": "int32",
              "id": 3
            },
            "vecFreezeTimeline": {
              "rule": "repeated",
              "type": "tagFrozenTimeLineInfo",
              "id": 4
            },
            "nErrorNo": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "ReqMSGC2SPetShoot": {
          "fields": {
            "strBulletId": {
              "type": "string",
              "id": 1
            },
            "strAngle": {
              "type": "string",
              "id": 2
            },
            "nGunRate": {
              "type": "int32",
              "id": 3
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 4
            },
            "nPointX": {
              "type": "int32",
              "id": 5
            },
            "nPointY": {
              "type": "int32",
              "id": 6
            },
            "nFrameCount": {
              "type": "int32",
              "id": 7
            },
            "nViolentRate": {
              "type": "int32",
              "id": 8
            }
          }
        },
        "RespMSGS2CPetShoot": {
          "fields": {
            "nErrorNo": {
              "type": "int32",
              "id": 1
            },
            "strMessage": {
              "type": "string",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            },
            "strBulletId": {
              "type": "string",
              "id": 4
            },
            "strAngle": {
              "type": "string",
              "id": 5
            },
            "nGunRate": {
              "type": "int32",
              "id": 6
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 7
            },
            "nPointX": {
              "type": "int32",
              "id": 8
            },
            "nPointY": {
              "type": "int32",
              "id": 9
            },
            "nViolentRatio": {
              "type": "int32",
              "id": 10
            },
            "nFrameCount": {
              "type": "int32",
              "id": 11
            },
            "bValidate": {
              "type": "bool",
              "id": 12
            },
            "nMoneyCost": {
              "type": "int64",
              "id": 13
            },
            "nNewFishIcon": {
              "type": "int64",
              "id": 14
            }
          }
        },
        "ReqTest": {
          "fields": {
            "cmd": {
              "type": "string",
              "id": 1
            }
          }
        },
        "RespTest": {
          "fields": {
            "result": {
              "type": "string",
              "id": 1
            }
          }
        },
        "ReqSyncDeskInfo": {
          "fields": {}
        },
        "RespSyncDeskInfo": {
          "fields": {
            "dwServerTime": {
              "type": "int64",
              "id": 1
            },
            "nMapId": {
              "type": "int32",
              "id": 2
            },
            "vecTimeline": {
              "rule": "repeated",
              "type": "tagTimeLineInfo",
              "id": 3
            },
            "vecPlayerInfo": {
              "rule": "repeated",
              "type": "tagPlayerInfo",
              "id": 4
            }
          }
        },
        "ReqLevelUpReward": {
          "fields": {}
        },
        "RespLevelUpReward": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nNewLevel": {
              "type": "int32",
              "id": 2
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 3
            },
            "vecSeniorProp": {
              "rule": "repeated",
              "type": "tagSeniorProps",
              "id": 4
            }
          }
        },
        "RespFunctionFishKilled": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nVerification": {
              "type": "int32",
              "id": 3
            },
            "nStartTimestamp": {
              "type": "int64",
              "id": 4
            },
            "nRemainTime": {
              "type": "int64",
              "id": 5
            },
            "nTimeLineId": {
              "type": "int32",
              "id": 6
            },
            "nAttackCount": {
              "type": "int32",
              "id": 7
            },
            "nScoreRate": {
              "type": "int32",
              "id": 8
            },
            "nRateArr": {
              "rule": "repeated",
              "type": "int64",
              "id": 9
            }
          }
        },
        "ReqFunctionFishShoot": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            },
            "SequenceId": {
              "type": "int32",
              "id": 2
            },
            "strAngle": {
              "type": "string",
              "id": 3
            },
            "nFunctionFishType": {
              "type": "int32",
              "id": 4
            },
            "nVerification": {
              "type": "int32",
              "id": 5
            },
            "nPointX": {
              "type": "int32",
              "id": 6
            },
            "nPointY": {
              "type": "int32",
              "id": 7
            }
          }
        },
        "RespFunctionFishShoot": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            },
            "SequenceId": {
              "type": "int32",
              "id": 2
            },
            "strAngle": {
              "type": "string",
              "id": 3
            },
            "nFunctionFishType": {
              "type": "int32",
              "id": 4
            },
            "nVerification": {
              "type": "int32",
              "id": 5
            },
            "nPointX": {
              "type": "int32",
              "id": 6
            },
            "nPointY": {
              "type": "int32",
              "id": 7
            },
            "nErrorCode": {
              "type": "int32",
              "id": 99
            }
          }
        },
        "ReqFunctionFishHit": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            },
            "SequenceId": {
              "type": "int32",
              "id": 2
            },
            "vecHitFishes": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            },
            "nStatus": {
              "type": "int32",
              "id": 5
            },
            "nVerification": {
              "type": "int32",
              "id": 8
            },
            "nFunctionFishType": {
              "type": "int32",
              "id": 9
            }
          }
        },
        "RespFunctionFishHit": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            },
            "SequenceId": {
              "type": "int32",
              "id": 2
            },
            "vecKilledFishes": {
              "rule": "repeated",
              "type": "tagKillFishInfo",
              "id": 4
            },
            "nStatus": {
              "type": "int32",
              "id": 5
            },
            "nNewFishCoin": {
              "type": "int64",
              "id": 8
            },
            "nVerification": {
              "type": "int32",
              "id": 9
            },
            "nFunctionFishType": {
              "type": "int32",
              "id": 10
            },
            "nGunRate": {
              "type": "int32",
              "id": 11
            },
            "nScoreRate": {
              "type": "int32",
              "id": 12
            },
            "vecDropProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 13
            },
            "vecDropSeniorProps": {
              "rule": "repeated",
              "type": "tagSeniorProps",
              "id": 14
            },
            "nFishCoin": {
              "type": "int32",
              "id": 15
            },
            "nErrorCode": {
              "type": "int32",
              "id": 99
            }
          }
        },
        "RespFunctionFishResult": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nFunctionFishType": {
              "type": "int32",
              "id": 2
            },
            "nNewFishCoin": {
              "type": "int64",
              "id": 3
            },
            "nTotalFishCoin": {
              "type": "int64",
              "id": 4
            },
            "nVerification": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "ReqStopSkill": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nSkillId": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "RespStopSkill": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nSkillId": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "ReqChestInfo": {
          "fields": {}
        },
        "RespChestInfo": {
          "fields": {
            "nFreeChestId": {
              "type": "int32",
              "id": 1
            },
            "nFreeLeftTime": {
              "type": "int32",
              "id": 2
            },
            "vecSlots": {
              "rule": "repeated",
              "type": "tagChestSlot",
              "id": 3
            }
          }
        },
        "ReqGetFreeChest": {
          "fields": {}
        },
        "RespGetFreeChestResult": {
          "fields": {
            "nErrorCode": {
              "type": "int32",
              "id": 1
            },
            "nSlotId": {
              "type": "int32",
              "id": 2
            },
            "nChestId": {
              "type": "int32",
              "id": 3
            },
            "nFreeChestId": {
              "type": "int32",
              "id": 4
            },
            "nFreeLeftTime": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "ReqUseChest": {
          "fields": {
            "nSlotId": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RespUseChestResult": {
          "fields": {
            "nErrorCode": {
              "type": "int32",
              "id": 1
            },
            "nSlotId": {
              "type": "int32",
              "id": 2
            },
            "nLeftTime": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "ReqOpenChest": {
          "fields": {
            "nSlotId": {
              "type": "int32",
              "id": 1
            },
            "nOpenType": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "RespOpenChestResult": {
          "fields": {
            "nErrorCode": {
              "type": "int32",
              "id": 1
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 2
            },
            "nSlotId": {
              "type": "int32",
              "id": 3
            },
            "vecDropProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 4
            },
            "vecDropSeniorProps": {
              "rule": "repeated",
              "type": "tagSeniorProps",
              "id": 5
            }
          }
        },
        "NotifyUseChestResult": {
          "fields": {
            "nErrorCode": {
              "type": "int32",
              "id": 1
            },
            "nChestId": {
              "type": "int32",
              "id": 2
            },
            "nSlotId": {
              "type": "int32",
              "id": 3
            },
            "nFishLine": {
              "type": "int32",
              "id": 4
            },
            "nPlayerId": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "NotifyFirstUnLockRoomReward": {
          "fields": {
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 1
            },
            "vecSeniorProp": {
              "rule": "repeated",
              "type": "tagSeniorProps",
              "id": 2
            }
          }
        },
        "ReqLuckRewardProgress": {
          "fields": {}
        },
        "RespLuckRewardProgress": {
          "fields": {
            "nRoomId": {
              "type": "int32",
              "id": 1
            },
            "nProgress": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "ReqStartLuckReward": {
          "fields": {
            "nType": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RespStartLuckReward": {
          "fields": {
            "nErrCode": {
              "type": "int32",
              "id": 1
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 2
            },
            "nPoolReward": {
              "type": "int64",
              "id": 3
            },
            "nPos": {
              "type": "int32",
              "id": 4
            },
            "nCoin": {
              "type": "int64",
              "id": 5
            },
            "nNewFishCoin": {
              "type": "int64",
              "id": 6
            },
            "nRandCount": {
              "type": "int32",
              "id": 7
            },
            "nType": {
              "type": "int32",
              "id": 8
            },
            "dAddition": {
              "type": "float",
              "id": 9
            }
          }
        },
        "ReqEndLuckReward": {
          "fields": {
            "nType": {
              "type": "int32",
              "id": 1
            },
            "nState": {
              "type": "int32",
              "id": 2
            },
            "nLevel": {
              "type": "int32",
              "id": 3
            },
            "nScore": {
              "type": "int64",
              "id": 4
            }
          }
        },
        "RespEndLuckReward": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nType": {
              "type": "int32",
              "id": 2
            },
            "nState": {
              "type": "int32",
              "id": 3
            },
            "nLevel": {
              "type": "int32",
              "id": 4
            },
            "nScore": {
              "type": "int64",
              "id": 5
            },
            "nNewFishCoin": {
              "type": "int64",
              "id": 6
            }
          }
        },
        "RespFishLuckWheelResult": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nVerification": {
              "type": "int32",
              "id": 2
            },
            "nScore": {
              "type": "int64",
              "id": 3
            },
            "vecRadio": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            },
            "nTotalRatio": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "ReqFishLuckWheelDraw": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nVerification": {
              "type": "int32",
              "id": 2
            },
            "nRadioId": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "RespFishLuckWheelDraw": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nRadioId": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "RespFishWinnerResult": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nVerification": {
              "type": "int32",
              "id": 2
            },
            "nTotalScore": {
              "type": "int64",
              "id": 3
            },
            "vecWinnerResult": {
              "rule": "repeated",
              "type": "tagFishCardList",
              "id": 4
            }
          }
        },
        "ReqFishWinnerOpenCard": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nVerification": {
              "type": "int32",
              "id": 2
            },
            "nScore": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "RespFishWinnerOpenCard": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nScore": {
              "type": "int32",
              "id": 2
            },
            "nNewFishCoin": {
              "type": "int64",
              "id": 3
            }
          }
        },
        "RespFishMoRiResult": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nVerification": {
              "type": "int32",
              "id": 2
            },
            "nLeftTime": {
              "type": "int64",
              "id": 3
            }
          }
        },
        "ReqFishMoRiEnd": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nVerification": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "RespFishMoRiEnd": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nVerification": {
              "type": "int32",
              "id": 2
            },
            "nScore": {
              "type": "int64",
              "id": 3
            }
          }
        },
        "NotifyMoRiTimeChange": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nTimeLineId": {
              "type": "int32",
              "id": 2
            },
            "nAddTime": {
              "type": "int32",
              "id": 3
            },
            "nCurRate": {
              "type": "int32",
              "id": 4
            },
            "nVerification": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "NotifyDropTimeGift": {
          "fields": {
            "nTimeGiftId": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NotifySpecialFishDrop": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nTimeLineId": {
              "type": "int32",
              "id": 2
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 3
            }
          }
        },
        "ReqFirstUnlockMidRoomTime": {
          "fields": {}
        },
        "RespFirstUnlockMidRoomTime": {
          "fields": {
            "nUnlockTime": {
              "type": "int64",
              "id": 1
            }
          }
        },
        "ReqBuyGodPigReward": {
          "fields": {}
        },
        "RespBuyGodPigReward": {
          "fields": {
            "nErrCode": {
              "type": "int32",
              "id": 1
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 2
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 3
            }
          }
        },
        "ReqGodPigScore": {
          "fields": {}
        },
        "RespGodPigScore": {
          "fields": {
            "nLevel": {
              "type": "int32",
              "id": 1
            },
            "nNeedScore": {
              "type": "int64",
              "id": 2
            },
            "nNowScore": {
              "type": "int64",
              "id": 3
            },
            "nNeedPropId": {
              "type": "int32",
              "id": 4
            },
            "nNeedCount": {
              "type": "int64",
              "id": 5
            },
            "nOiginalPrice": {
              "type": "int64",
              "id": 6
            },
            "nErrorCode": {
              "type": "int32",
              "id": 7
            },
            "nIsNotify": {
              "type": "int32",
              "id": 8
            }
          }
        },
        "ReqGodPigLvRewardInfo": {
          "fields": {}
        },
        "RespGodPigLvRewardInfo": {
          "fields": {
            "vecLvReward": {
              "rule": "repeated",
              "type": "tagGodPigLvReward",
              "id": 1
            },
            "nBuyLevel": {
              "type": "int32",
              "id": 2
            },
            "nMaxLevel": {
              "type": "int32",
              "id": 3
            },
            "nErrorCode": {
              "type": "int32",
              "id": 4
            }
          }
        },
        "ReqGodPigLvRewardGet": {
          "fields": {
            "nLevel": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RespGodPigLvRewardGet": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "vecLvReward": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 2
            },
            "nErrorCode": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "ReqPlayerBankrupt": {
          "fields": {}
        },
        "RespPlayerBankrupt": {
          "fields": {}
        },
        "NotifyMSGS2CViolentTimeOut": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NotifyMSGS2CGameAnnouceString": {
          "fields": {
            "strMsgTemplete": {
              "type": "string",
              "id": 1
            },
            "dwDeskId": {
              "type": "int32",
              "id": 3
            },
            "dwRoomId": {
              "type": "int32",
              "id": 4
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 5
            },
            "strParams": {
              "rule": "repeated",
              "type": "string",
              "id": 6
            }
          }
        },
        "NotifyMSGS2CPlayerJoin": {
          "fields": {
            "tPlayerInfo": {
              "type": "tagPlayerInfo",
              "id": 1
            }
          }
        },
        "NotifyMSGC2SPlayerLeave": {
          "fields": {
            "nLeaveCode": {
              "type": "int32",
              "id": 1
            },
            "strLeaveReason": {
              "type": "string",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            },
            "lLeaveTimestamp": {
              "type": "int64",
              "id": 4
            }
          }
        },
        "NotifyMSGS2CExpChanged": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nNewExp": {
              "type": "int64",
              "id": 2
            },
            "nCurLv": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "NotifyMSGS2CPlayerDataChange": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 2
            },
            "vecSeniorProp": {
              "rule": "repeated",
              "type": "tagSeniorProps",
              "id": 3
            }
          }
        },
        "NotifyMSGFishCoinRecord": {
          "fields": {
            "dwType": {
              "type": "int32",
              "id": 1
            },
            "dwDeskId": {
              "type": "int32",
              "id": 2
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "NotifyMSGS2CDressChange": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nGunId": {
              "type": "int32",
              "id": 2
            },
            "nWingId": {
              "type": "int32",
              "id": 3
            },
            "nPetId": {
              "type": "int32",
              "id": 4
            },
            "nAvatarFrameId": {
              "type": "int32",
              "id": 5
            },
            "nCallingCardId": {
              "type": "int32",
              "id": 6
            }
          }
        },
        "NotifyMSGS2CSyncRewardPool": {
          "fields": {
            "nRoomId": {
              "type": "int32",
              "id": 1
            },
            "nPoolReward": {
              "type": "int64",
              "id": 2
            }
          }
        },
        "NotifyTimeLine": {
          "fields": {
            "VecTimeLineInfo": {
              "rule": "repeated",
              "type": "tagTimeLineInfo",
              "id": 1
            }
          }
        },
        "NotifyLockOnOver": {
          "fields": {
            "nPlayerId": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NotifySceneSwitch": {
          "fields": {
            "nSceneId": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NotifySceneWillSwitch": {
          "fields": {
            "nSceneId": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NotifyMSGKickOffTime": {
          "fields": {
            "nTime": {
              "type": "int32",
              "id": 1
            },
            "bKickOff": {
              "type": "bool",
              "id": 2
            }
          }
        },
        "NotifyMSGBossStatus": {
          "fields": {
            "nStatus": {
              "type": "int32",
              "id": 1
            },
            "FishId": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "NotifyMSGFunctionFishes": {
          "fields": {
            "vecFunctionFishes": {
              "rule": "repeated",
              "type": "tagFunctionFishInfo",
              "id": 1
            }
          }
        },
        "NotifyNextSceneProcess": {
          "fields": {
            "BeginTime": {
              "type": "int64",
              "id": 1
            },
            "DurationTime": {
              "type": "int64",
              "id": 2
            },
            "FishId": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "tagTimeLineInfo": {
          "fields": {
            "TimeLineId": {
              "type": "int32",
              "id": 1
            },
            "FishId": {
              "type": "int32",
              "id": 2
            },
            "PathId": {
              "type": "int32",
              "id": 3
            },
            "MapId": {
              "type": "int32",
              "id": 4
            },
            "BeginTime": {
              "type": "int64",
              "id": 5
            },
            "LifeTime": {
              "type": "float",
              "id": 6
            },
            "IsFreeze": {
              "type": "int32",
              "id": 7
            },
            "FreezeEndTime": {
              "type": "int64",
              "id": 8
            },
            "Pos_X": {
              "type": "int32",
              "id": 9
            },
            "Pos_Y": {
              "type": "int32",
              "id": 10
            },
            "IsCallFish": {
              "type": "bool",
              "id": 11
            },
            "TimeLineCreateTime": {
              "type": "int64",
              "id": 12
            }
          }
        },
        "tagFrozenTimeLineInfo": {
          "fields": {
            "TimeLineId": {
              "type": "int32",
              "id": 1
            },
            "IsFreeze": {
              "type": "int32",
              "id": 2
            },
            "FreezeEndTime": {
              "type": "int64",
              "id": 3
            }
          }
        },
        "tagGhostLegion": {
          "fields": {
            "vecPoker": {
              "rule": "repeated",
              "type": "tagGhostPoker",
              "id": 1
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 2
            },
            "nTime": {
              "type": "int32",
              "id": 3
            },
            "nType": {
              "type": "int32",
              "id": 4
            }
          }
        },
        "tagGhostPoker": {
          "fields": {
            "nValue": {
              "type": "int32",
              "id": 1
            },
            "nColor": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "tagProp": {
          "fields": {
            "propId": {
              "type": "int32",
              "id": 1
            },
            "propCount": {
              "type": "int64",
              "id": 2
            }
          }
        },
        "tagSeniorProps": {
          "fields": {
            "propId": {
              "type": "int32",
              "id": 1
            },
            "expTime": {
              "type": "int32",
              "id": 2
            },
            "propCount": {
              "type": "int32",
              "id": 3
            },
            "strPatchData": {
              "type": "string",
              "id": 4
            }
          }
        },
        "tagDress": {
          "fields": {
            "itemType": {
              "type": "int32",
              "id": 1
            },
            "itemId": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "tagBulletInfo": {
          "fields": {
            "strBulletId": {
              "type": "string",
              "id": 1
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 2
            },
            "nFrameCount": {
              "type": "int32",
              "id": 3
            },
            "strAngle": {
              "type": "string",
              "id": 4
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 5
            },
            "nPointX": {
              "type": "int32",
              "id": 6
            },
            "nPointY": {
              "type": "int32",
              "id": 7
            },
            "bIsViolent": {
              "type": "bool",
              "id": 8
            }
          }
        },
        "tagBatchBulletInfo": {
          "fields": {
            "strBulletId": {
              "type": "string",
              "id": 1
            },
            "strAngle": {
              "type": "string",
              "id": 2
            },
            "nPointX": {
              "type": "int32",
              "id": 3
            },
            "nPointY": {
              "type": "int32",
              "id": 4
            },
            "dwGunId": {
              "type": "int32",
              "id": 5
            },
            "dwTimelineId": {
              "type": "int32",
              "id": 6
            },
            "nValidate": {
              "type": "int32",
              "id": 7
            }
          }
        },
        "tagKillFishInfo": {
          "fields": {
            "dwTimelineId": {
              "type": "int32",
              "id": 1
            },
            "nRatio": {
              "type": "int32",
              "id": 3
            },
            "nFishCoin": {
              "type": "int64",
              "id": 4
            }
          }
        },
        "tagCalledFishInfo": {
          "fields": {
            "dwFrameId": {
              "type": "int32",
              "id": 1
            },
            "dwPathId": {
              "type": "int32",
              "id": 2
            },
            "dwFishTypeId": {
              "type": "int32",
              "id": 3
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 4
            },
            "dwCallFishId": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "tagCommonShareItem": {
          "fields": {
            "nShareType": {
              "type": "int32",
              "id": 1
            },
            "nShareCount": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "tagArenaSignupItem": {
          "fields": {
            "nArenaType": {
              "type": "int32",
              "id": 1
            },
            "nCount": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "tagArenaRankPlayerItem": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "strNickName": {
              "type": "string",
              "id": 2
            },
            "nScore": {
              "type": "int32",
              "id": 3
            },
            "nBulletCount": {
              "type": "int32",
              "id": 4
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 5
            }
          }
        },
        "tagArenaFreePlayerInfo": {
          "fields": {
            "nBulletCount": {
              "type": "int32",
              "id": 1
            },
            "nGunRate": {
              "type": "int32",
              "id": 2
            },
            "nScore": {
              "type": "int32",
              "id": 3
            },
            "nChairId": {
              "type": "int32",
              "id": 4
            },
            "nErrorCode": {
              "type": "int32",
              "id": 5
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 6
            },
            "nFishCoin": {
              "type": "int64",
              "id": 7
            },
            "nCrystal": {
              "type": "int32",
              "id": 8
            },
            "vecSignUpHistory": {
              "rule": "repeated",
              "type": "tagArenaSignupItem",
              "id": 9
            },
            "strNickName": {
              "type": "string",
              "id": 10
            },
            "nGunType": {
              "type": "int32",
              "id": 11
            },
            "dwPlayerId": {
              "type": "int32",
              "id": 12
            },
            "nMaxGunRate": {
              "type": "int32",
              "id": 13
            },
            "nVipExp": {
              "type": "int32",
              "id": 14
            },
            "nLeftMonthCardDay": {
              "type": "int32",
              "id": 15
            },
            "bMonthCardRewardToken": {
              "type": "bool",
              "id": 16
            },
            "strNickImg": {
              "type": "string",
              "id": 17
            },
            "nHeadFrameId": {
              "type": "int32",
              "id": 18
            }
          }
        },
        "tagPlayerInfo": {
          "fields": {
            "dwPlayerId": {
              "type": "int32",
              "id": 1
            },
            "nChairId": {
              "type": "int32",
              "id": 2
            },
            "nFishCoin": {
              "type": "int64",
              "id": 3
            },
            "nCrystal": {
              "type": "int64",
              "id": 4
            },
            "nVipExp": {
              "type": "int64",
              "id": 5
            },
            "nGradeExp": {
              "type": "int64",
              "id": 6
            },
            "nLevel": {
              "type": "int32",
              "id": 7
            },
            "nGunType": {
              "type": "int32",
              "id": 8
            },
            "nCurrentGunRate": {
              "type": "int32",
              "id": 9
            },
            "nCurCannonPower": {
              "type": "int32",
              "id": 10
            },
            "strNickName": {
              "type": "string",
              "id": 11
            },
            "strNickImg": {
              "type": "string",
              "id": 12
            },
            "IsViolent": {
              "type": "bool",
              "id": 13
            },
            "IsLockOn": {
              "type": "bool",
              "id": 14
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 15
            },
            "vecSeniorProp": {
              "rule": "repeated",
              "type": "tagSeniorProps",
              "id": 16
            },
            "vecDress": {
              "rule": "repeated",
              "type": "tagDress",
              "id": 17
            },
            "nSendChatCount": {
              "type": "int32",
              "id": 18
            }
          }
        },
        "tagChestSlot": {
          "fields": {
            "nSlotId": {
              "type": "int32",
              "id": 1
            },
            "nChestId": {
              "type": "int32",
              "id": 2
            },
            "nLeftTime": {
              "type": "int32",
              "id": 3
            },
            "bLock": {
              "type": "bool",
              "id": 4
            },
            "bOpen": {
              "type": "bool",
              "id": 5
            }
          }
        },
        "tagFishWinnerCard": {
          "fields": {
            "nFishId": {
              "type": "int32",
              "id": 1
            },
            "nRadio": {
              "type": "int32",
              "id": 2
            },
            "nCoin": {
              "type": "int64",
              "id": 3
            }
          }
        },
        "tagFishCardList": {
          "fields": {
            "openedFishCard": {
              "type": "tagFishWinnerCard",
              "id": 1
            },
            "vecFishCard": {
              "rule": "repeated",
              "type": "tagFishWinnerCard",
              "id": 2
            }
          }
        },
        "tagFunctionFishInfo": {
          "fields": {
            "nFishId": {
              "type": "int32",
              "id": 1
            },
            "nTraceType": {
              "type": "int32",
              "id": 2
            },
            "nPlayerId": {
              "type": "int32",
              "id": 3
            },
            "nVerification": {
              "type": "int32",
              "id": 4
            },
            "nFishCoin": {
              "type": "int64",
              "id": 5
            },
            "nFishRadio": {
              "type": "int32",
              "id": 6
            },
            "nGunRate": {
              "type": "int32",
              "id": 7
            },
            "lifeTime": {
              "type": "float",
              "id": 8
            },
            "nAttackCount": {
              "type": "int32",
              "id": 9
            },
            "nHitCount": {
              "type": "int32",
              "id": 10
            },
            "nRateArr": {
              "rule": "repeated",
              "type": "int64",
              "id": 11
            },
            "durationTime": {
              "type": "float",
              "id": 12
            },
            "dropDoubleCount": {
              "type": "int32",
              "id": 13
            },
            "isShoot": {
              "type": "bool",
              "id": 14
            },
            "strAngle": {
              "type": "string",
              "id": 15
            },
            "nPointX": {
              "type": "int32",
              "id": 16
            },
            "nPointY": {
              "type": "int32",
              "id": 17
            },
            "nPathId": {
              "type": "int32",
              "id": 18
            },
            "nScoreRate": {
              "type": "int32",
              "id": 19
            },
            "nKillFishCount": {
              "type": "int32",
              "id": 20
            },
            "nRadioId": {
              "type": "int32",
              "id": 21
            },
            "vecRadio": {
              "rule": "repeated",
              "type": "int32",
              "id": 22
            }
          }
        },
        "tagMatchTaskProcess": {
          "fields": {
            "nFishId": {
              "type": "int32",
              "id": 1
            },
            "nKillNum": {
              "type": "int32",
              "id": 2
            },
            "nNeedKillNum": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "tagMatchTaskInfo": {
          "fields": {
            "nTaskId": {
              "type": "int32",
              "id": 1
            },
            "nReward": {
              "type": "int32",
              "id": 2
            },
            "nStatus": {
              "type": "int32",
              "id": 3
            },
            "nTaskLeftTime": {
              "type": "int64",
              "id": 4
            },
            "taskData": {
              "rule": "repeated",
              "type": "tagMatchTaskProcess",
              "id": 5
            }
          }
        },
        "tagGodPigLvReward": {
          "fields": {
            "nLevel": {
              "type": "int32",
              "id": 1
            },
            "vecProps": {
              "rule": "repeated",
              "type": "tagProp",
              "id": 2
            },
            "nIsGet": {
              "type": "int32",
              "id": 3
            }
          }
        }
      }
    }
  }
} 