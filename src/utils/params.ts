//注册车辆参数接口
export interface VehicleInterface {
    modelCode: string;
    vehicleID: string;
    ip: string;
}

 export interface VehiclelDeviceInterface {
     deviceID: string;
     modelDeviceCode: string;
     sysDescr: string;
     sysName: string;
     deviceIP: string;
  }  

  export interface FlowdataInterface {
      createTime: string;
      type: string;
      dataTotal: string;
  }

  export interface EventdataInterface {
      eventTime: string;
      ip_src: string;
      ip_dst: string;
      code: string;
  }

  export interface LogdataInterface {
      logTime: string;
      hostName: string;
      processName: string;
      content: string;
  }
