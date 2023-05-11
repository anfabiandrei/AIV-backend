process.env.NODE_ENV = 'test'

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect
;(fs = require('fs')), (server = require('./app'))

chai.use(chaiHttp)

describe('Users API', () => {
  before(() => {
    const TEST_DATA = JSON.stringify({items: [{ id: "xl-tshirt" }]})

    fs.writeFileSync('data-test.json', JSON.stringify(TEST_DATA))
  })

  it('stripe call', done => {
    chai
      .request(server)
      .post('/create-payment-intent')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        console.log(res.body)

        done()
      })
  })
})