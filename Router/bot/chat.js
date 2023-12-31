const Store = require('../../model/Data')

const router = require('express').Router()


router.get('/', async (req, res) => {
    try {
        const response = await Store.find()
        res.send({ lenght: response?.length, data: response })

    } catch (error) {
        res.status(500).send({ message: "Something went wrong!", error: error })
    }
})

router.post('/search', async (req, res) => {
    const { search } = req.body
    try {
        const response = await Store.find({ title: { $regex: search, $options: 'i' } })
        res.send({ lenght: response?.length, data: response })

    } catch (error) {
        res.status(500).send({ message: "Something went wrong!", error: error })
    }
})

router.post('/', async (req, res) => {
    const newData = new Store(req.body)
    try {
        const response = await newData.save()
        res.send({ message: "Data saved successfully!", data: response })

    } catch (error) {
        res.status(500).send({ message: "Something went wrong!", error: error })
    }
})

router.put('/:id', async (req, res) => {

    try {
        const response = await Store.findByIdAndUpdate(req.params.id, req.body)
        res.send({ message: "Data updated successfully!", data: response })
    } catch (error) {
        res.status(500).send({ message: "Something went wrong!", error: error })
    }
})

router.delete('/:id', async (req, res) => {

    try {
        const response = await Store.findByIdAndDelete(req.params.id)
        res.send({ message: "Data deleted successfully!", data: response })
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong!', error: error })
    }
})

module.exports = router