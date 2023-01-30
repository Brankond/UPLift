const recipients_data = [
    {   
        id: "1",
        name: "Nick"
    },
    {
        id: "2",
        name: "Tom"
    },
    {
        id: "3",
        name: "Jack"
    },
    {
        id: '4',
        name: 'Jasmine'
    },
    {
        id: '5',
        name: 'Jake',
    },
    {
        id: '6',
        name: 'Nicole'
    },
    {
        id: '7',
        name: 'Thomas'
    },
    {
        id: '8',
        name: 'Tim'
    }
]

const alphabetic_ordered_recipients_data =  [
    {   
        alphabet: 'J',
        data: [
            {
                id: '3',
                name: 'Jack'
            },
            {
                id: '4',
                name: 'Jasmine'
            },
            {
                id: '5',
                name: 'Jake',
            }
        ]
    },
    {   
        alphabet: 'N',
        data:[
            {
                id: '2',
                name: 'Nick'
            },
            {
                id: '6',
                name: 'Nicole'
            }
        ] 
    },
    {
        alphabet: 'T',
        data: [
            {
                id: '1',
                name: 'Tom'
            },
            {
                id: '8',
                name: 'Tim'
            }
        ]
    }
]

export {recipients_data, alphabetic_ordered_recipients_data}