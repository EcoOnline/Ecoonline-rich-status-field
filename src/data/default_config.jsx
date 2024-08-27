
export const DEFAULT_CONFIGURATION = {
    progressList: [
        {
            label: "Not started",
            value: 0,
            rag: "default",
            isbold: 0,
            isresolved: 0,
        },
        {
            label: "On track",
            value: 1,
            rag: "success",
            isbold: 0,
            isresolved: 0,
        },
        {
            label: "At risk",
            value: 2,
            rag: "moved",
            isbold: 0,
            isresolved: 0,
        },
        {
            label: "Behind",
            value: 3,
            rag: "removed",
            isbold: 0,
            isresolved: 0,
        },
        {
            label: "Done",
            value: 4,
            rag: "success",
            isbold: 1,
            isresolved: 1,
        },
        {
            label: "Cancelled",
            value: 5,
            rag: "removed",
            isbold: 1,
            isresolved: 1,
        }
    ],
    ragList: [
        {
            label: "Red",
            value: "removed"
        },
        {
            label: "Amber",
            value: "moved",
        },
        {
            label: "Green",
            value: "success"
        },
        {
            label:"Grey",
            value: "default"
        },
        {
            label:"Navy",
            value: "inprogress"
        },
        {
            label:"Purple",
            value: "new"
        }
    ],
    maxResults: 5
};
export const DEFAULT_VALUE={
    result_0:{
        result:"",
        status:"",
        eta:""
    },
    resultCount:0
};
export const TABLE_HEADERS = {
    cells: [{
        key:"result",
        content: "Key result",
        isSortable: true,
      },
      {
        key:"status",
        content: "Status",
        isSortable: true,
        width:"30%"
      },
      {
        key:"eta",
        content: "ETA",
        isSortable: true,
        width:"30%"
        
      }
    ]
}
