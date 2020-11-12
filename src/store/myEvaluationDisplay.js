export const state = () => ({
  myEvaluation: [],
  primary: [],
  secondary: [],
  member: [],
  myWantRank: '',
  indicators: [],
  myEvaluationEvaluatorName: '',
  primaryEvaluatorName: '',
  secondaryEvaluatorName: '',
  indicator: '',
  me: [],
  errorFlag: '',
  presenterFlag: '',
})

export const mutations = {
  setMe(state, me) {
    state.me = me
    console.log(me)
  },
  setMyEvaluation(state, myEvaluation) {
    state.myEvaluation = myEvaluation
  },
  setMember(state, member) {
    state.member = member.sort(() => Math.random() - 0.5)
  },
  setSecondary(state, secondary) {
    state.secondary = secondary
  },
  setPrimary(state, primary) {
    state.primary = primary
  },
  setMyEvaluationEvaluatorName(state, myEvaluationEvaluatorName) {
    state.myEvaluationEvaluatorName = myEvaluationEvaluatorName
  },
  setSecondaryEvaluatorName(state, secondaryEvaluatorName) {
    state.secondaryEvaluatorName = secondaryEvaluatorName
  },
  setPrimaryEvaluatorName(state, primaryEvaluatorName) {
    state.primaryEvaluatorName = primaryEvaluatorName
  },
  setMyWantRank(state, myWantRank) {
    state.myWantRank = myWantRank
  },
  setIndicators(state, indicators) {
    state.indicators = indicators
  },
  setIndicator(state, indicator) {
    state.indicator = indicator
  },
  setErrorFlag(state, errorFlag) {
    state.errorFlag = errorFlag
  },
  setPresenterFlag(state, presenterFlag) {
    state.presenterFlag = presenterFlag
  },
}

export const actions = {
  async getMe({ dispatch, commit }) {
    await this.$axios
      .$get(`/me`)
      .then((response) => {
        response = require(`../testdata/me_sample.json`)
        commit('setMe', response)
      })
      .catch(function (error) {
        console.log(error)
        dispatch('displayErrorSnackbar', 'ログインユーザ情報の取得に失敗しました')
      })
  },
  async getMyEvaluationDisplay({ commit, dispatch, state, rootState }) {
    await dispatch(`getMe`)
    const presenter = await this.$axios.$get(
      `/presenters?filter_user_id=${state.me.id}&filter_presentation_id=${rootState.presentationTabs.presentation.id}`
    )
    console.log(presenter.items)
    if (presenter.items.id === undefined) {
      const presenterFlag = true
      commit('setPresenterFlag', presenterFlag)
      console.log(presenterFlag)
    } else {
      const res = await this.$axios
        .$get(`/evaluation_and_feedbacks?presenter_id=${presenter.items[0].id}`)
        .catch(function () {
          const errorFlag = true
          commit('setPresenterFlag', errorFlag)
          console.log(errorFlag)
        })
      // const res = await this.$axios.$get(`/evaluation_and_feedback?filter_presenter_id=${presenter.items[0].id}`)
      const id = res.items[0].presenter_id
      const professionId = res.items[0].profession_id
      const resp = await this.$axios.$get(`/presenters/${id}`)
      // const res = await require('../testdata/evaluation_and_feedback.json')
      // const resp = await require('../testdata/presenters.json')
      const presenters = resp.items[0]
      const myEvaluationDisplay = res.items
      let myEvaluation = ''
      let secondary = ''
      let primary = ''
      const member = []
      for (let i = 0; i < myEvaluationDisplay.length; i++) {
        if (myEvaluationDisplay[i].evaluator_id === myEvaluationDisplay[i].presenter_id) {
          myEvaluation = Object.assign({}, myEvaluationDisplay[i])
        } else if (myEvaluationDisplay[i].evaluator_id === presenters.primary_evaluator_id) {
          primary = Object.assign({}, myEvaluationDisplay[i])
        } else if (myEvaluationDisplay[i].evaluator_id === presenters.secondary_evaluator_id) {
          secondary = Object.assign({}, myEvaluationDisplay[i])
        } else {
          myEvaluationDisplay[i].evaluator.name = '匿名'
          member.push(myEvaluationDisplay[i])
        }
      }
      console.log(myEvaluation)
      commit('setPrimary', primary)
      commit('setMyEvaluation', myEvaluation)
      commit('setMember', member)
      commit('setSecondary', secondary)
      const myEvaluationEvaluatorName = myEvaluation.evaluator.name
      commit('setMyEvaluationEvaluatorName', myEvaluationEvaluatorName)
      const primaryEvaluatorName = primary.evaluator.name
      commit('setPrimaryEvaluatorName', primaryEvaluatorName)
      const secondaryEvaluatorName = secondary.evaluator.name
      commit('setSecondaryEvaluatorName', secondaryEvaluatorName)
      const rankSelectOptions = res.items.map((item) => {
        return {
          text: item.want_rank_id,
          value: item.presenter_id,
          profId: item.evaluator_id,
          indicatorCategoryEvaluationAndFeedbacks: item.indicatorCategoryEvaluationAndFeedbacks,
        }
      })
      const items = rankSelectOptions.filter((item) => item.profId === item.value)
      const myWantRank = items[0].text
      commit('setMyWantRank', myWantRank)
      const indicators = await this.$axios.$get(`/indicator_categories?filter_profession_id=${professionId}`)
      commit('setIndicators', indicators)
    }
  },
}
